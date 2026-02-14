---
title: SpringBoot3 and pinned versions
date: 2023-12-09
---

Who doesn't know the feeling? It was Thursday, almost 4 o'clock, so I decided to quickly switch to a new major version
of [SpringBoot](https://spring.io/projects/spring-boot), only to end up wasting time on a trivial issue.

## Necessary changes

Since the application was still running on Java 11, I inevitably decided to migrate directly to Java 17.

```xml
<properties>
    <java.version>17</java.version>
    ...
</properties>
```

Only to realize in the next moment that the plugins I was using were not really happy with this change.

```plaintext
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.8.1:compile (default-compile) on project app-project: Fatal error compiling: java.lang.IllegalAccessError: class lombok.javac.apt.LombokProcessor (in unnamed module @0x5a47730c) cannot access class com.sun.tools.javac.processing.JavacProcessingEnvironment (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.processing to unnamed module @0x5a47730c -> [Help 1]
```

So, I started looking for their latest versions and happily made all the updates to:

- Lombok
- MapStruct
- SureFire
- some unsung git-commit-id plugin
- etc

To avoid any foreseeable issues, I carefully read through the migration guide and was glad to find out that
trailing slash matching has been [disabled by default](https://github.com/spring-projects/spring-framework/issues/28552).
Accordingly, I adjusted the MVC tests.

At that moment, I overlooked an external system test that inconsistently uses exactly those trailing slashes.
But that was a problem for the next day.

The migration guide also recommended replacing `javax` with `jakarta` packages.
A Ctrl+R later, I realized to better not rename all the Java SE package imports.

Up to this point, everything was running smoothly.

## Until it wasn't

Thinking I had conquered all issues, I ran the failsafe tests and was surprised by the following error:

```plaintext
Caused by: java.lang.IllegalArgumentException:
LoggerFactory is not a Logback LoggerContext but Logback is on the classpath.
Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:/C:/Users/timse/.m2/repository/org/slf4j/slf4j-api/1.7.1/slf4j-api-1.7.1.jar).
If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

Honestly, why is it always the things you understand the least that break?
I strongly believe that logging should be simple.
However, logging in Java can be many things, but it is certainly not simple.

The initial suggestion from StackOverflow was to exclude "logback-classic" which didn't seem reasonable,
but with nothing to lose, I tried it anyway.
Much to my surprise, the test passed! 👍

```plaintext
[INFO] -----------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -----------------------------------------------
```

## Obviously that wasn't the solution

When I attempted to start the application, I was faced with a disheartening realization:

```plaintext
Exception in thread "main" java.lang.IllegalArgumentException:
LoggerFactory is not a Logback LoggerContext but Logback is on the classpath.
Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:/C:/Users/timse/.m2/repository/org/slf4j/slf4j-api/1.7.1/slf4j-api-1.7.1.jar).
If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

The same error.

Consequently, I donned my detective hat and proceeded to analyze the situation.

### The origin of the slf4j-api transitive dependency

```bash
$ mvn dependency:tree -Dincludes=org.slf4j:sl4j-api
...
[INFO] --- dependency:3.6.1:tree (default-cli) @ sl4jlogbackerror ---
[INFO] de.timse:reproducingtheslf4jerror:jar:0.0.1-SNAPSHOT
[INFO] \- org.springframework.boot:spring-boot-starter-logging:jar:3.2.0:compile
[INFO]    \- ch.qos.logback:logback-classic:jar:1.4.11:compile
[INFO]       \- org.slf4j:slf4j-api:jar:1.7.1:compile
```

So far, so bad. How could it be that the spring-boot-starter-logging had a dependency that caused the application to break?

The spring-boot-starter-logging dependency relied on three libraries:

- logback-classic
- log4j-to-slf4j
- jul-to-slf4j

All of them had specified the slf4j-api version of **2.0.7** in their parent POM.
On a closer look, something stood out!

If **2.0.7** was the correct version and there was no other dependency overwriting it,
then there could only be one person causing the setting to be different...

![well of course I know him, He's me](./wellIknowhm.webp)

Clearly, nestled among various other configurations in the properties within the POM,
there was a little pinned version number:

```xml
<properties>
    ...
    <slf4j.version>1.7.1</slf4j.version>
</properties>
```

I took a long look outside my window and called it a day!
