---
title: Spring Boot 3 and Pinned Versions
date: 2023-12-09
---

Who doesn't know the feeling? It was Thursday, almost 4 PM, and I decided to quickly switch to a new major version
of [Spring Boot](https://spring.io/projects/spring-boot), only to end up wasting time on a trivial issue.

## Necessary changes

Since the application was still running on Java 11, I decided to migrate straight to Java 17.

```xml
<properties>
    <java.version>17</java.version>
    ...
</properties>
```

A moment later, I realized that the plugins I was using were not exactly happy with that change.

```plaintext
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.8.1:compile (default-compile) on project app-project: Fatal error compiling: java.lang.IllegalAccessError: class lombok.javac.apt.LombokProcessor (in unnamed module @0x5a47730c) cannot access class com.sun.tools.javac.processing.JavacProcessingEnvironment (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.processing to unnamed module @0x5a47730c -> [Help 1]
```

So I looked up the latest versions and happily updated:

- Lombok
- MapStruct
- Surefire
- some unsung `git-commit-id` plugin
- etc

To avoid foreseeable issues, I carefully read through the migration guide and was glad to find out that
trailing slash matching had been [disabled by default](https://github.com/spring-projects/spring-framework/issues/28552).
Accordingly, I adjusted the MVC tests.

At that moment, I overlooked one external system test that inconsistently used those exact trailing slashes.
That was a problem for the next day.

The migration guide also recommended replacing `javax` with `jakarta` packages.
One Ctrl+R later, I realized it was better not to rename all Java SE package imports.

Up to this point, everything was running smoothly.

## Until it wasn't

Thinking I had conquered all issues, I ran the failsafe tests and was greeted by the following error:

```plaintext
Caused by: java.lang.IllegalArgumentException:
LoggerFactory is not a Logback LoggerContext but Logback is on the classpath.
Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:/C:/Users/timse/.m2/repository/org/slf4j/slf4j-api/1.7.1/slf4j-api-1.7.1.jar).
If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

Honestly, why is it always the stuff you understand the least that breaks?
I strongly believe that logging should be simple.
Logging in Java can be many things, but simple is usually not one of them.

The initial Stack Overflow suggestion was to exclude `logback-classic`, which did not seem reasonable.
But with nothing to lose, I tried it anyway.
To my surprise, the test passed! 👍

```plaintext
[INFO] -----------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -----------------------------------------------
```

## Obviously that wasn't the solution

When I tried to start the application, I was faced with a disheartening realization:

```plaintext
Exception in thread "main" java.lang.IllegalArgumentException:
LoggerFactory is not a Logback LoggerContext but Logback is on the classpath.
Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:/C:/Users/timse/.m2/repository/org/slf4j/slf4j-api/1.7.1/slf4j-api-1.7.1.jar).
If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

The same error.

So I put on my detective hat and started digging.

### The origin of the slf4j-api transitive dependency

```bash
$ mvn dependency:tree -Dincludes=org.slf4j:slf4j-api
...
[INFO] --- dependency:3.6.1:tree (default-cli) @ slf4jlogbackerror ---
[INFO] de.timse:reproducingtheslf4jerror:jar:0.0.1-SNAPSHOT
[INFO] \- org.springframework.boot:spring-boot-starter-logging:jar:3.2.0:compile
[INFO]    \- ch.qos.logback:logback-classic:jar:1.4.11:compile
   [INFO]       \- org.slf4j:slf4j-api:jar:1.7.1:compile
```

So far, so bad. How could `spring-boot-starter-logging` pull in a dependency that broke the app?

`spring-boot-starter-logging` depends on three libraries:

- logback-classic
- log4j-to-slf4j
- jul-to-slf4j

All of them specified `slf4j-api` version **2.0.7** in their parent POM.
On closer inspection, something stood out.

If **2.0.7** was the correct version and no other dependency was overriding it,
there could only be one person causing the mismatch...

![well of course I know him, He's me](./wellIknowhm.webp)

Buried among a bunch of other properties in the POM, there was a tiny pinned version:

```xml
<properties>
    ...
    <slf4j.version>1.7.1</slf4j.version>
</properties>
```

I stared out the window for a while and called it a day.
