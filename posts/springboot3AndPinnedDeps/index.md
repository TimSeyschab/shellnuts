---
title: SpringBoot3 and pinned versions
date: 2023-12-09
---

Who doesn't know the feeling? It's almost 4 o'clock, and you decide to quickly switch to a new major version of [SpringBoot](https://spring.io/projects/spring-boot), only to end up wasting time on a trivial issue.

## It always starts so easy

Since the application is still running on Java 11, you inevitably decide to migrate directly to Java 17.

```xml
<properties>
    <java.version>17</java.version>
    ...
</properties>
```

Only to realize the next moment that the used plugins are not happy with this change.

```plaintext
[ERROR] Failed to execute goal org.apache.maven.plugins:maven-compiler-plugin:3.8.1:compile (default-compile) on project app-project: Fatal error compiling: java.lang.IllegalAccessError: class lombok.javac.apt.LombokProcessor (in unnamed module @0x5a47730c) cannot access class com.sun.tools.javac.processing.JavacProcessingEnvironment (in module jdk.compiler) because module jdk.compiler does not export com.sun.tools.javac.processing to unnamed module @0x5a47730c -> [Help 1]
```

So, you start looking for the latest versions of the plugins and happily make all the updates:

- Lombok
- MapStruct
- SureFire
- ...

To avoid obvious problems, you read through the migration guide and fortunately learn that trailing slash matching has been [disabled by default](https://github.com/spring-projects/spring-framework/issues/28552). So, you also adjust the MVC tests.

Some might forget that there's also an external system test that is not so forgiving with slashes. But that should be a problem for the next day.

The migration guide also suggests replacing javax with jakarta packages. A Ctrl+R later, you realize better not to rename the SE packages.

Up to this point, everything is smooth.

## Well obviously it breaks

Thinking you've conquered the issue, you run the failsafe tests and are surprised by the following error:

```plaintext
Caused by: java.lang.IllegalArgumentException: 
LoggerFactory is not a Logback LoggerContext but Logback is on the classpath. 
Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:/C:/Users/timse/.m2/repository/org/slf4j/slf4j-api/1.7.1/slf4j-api-1.7.1.jar). 
If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

Why is it always the things you understand the least that break? I firmly believe logging should be simple; however, logging in Java may be many things, but it is definitely not simple.

The initial suggestion to exclude "logback-classic" doesn't seem reasonable, but with nothing to lose you try it anyway. 
Lo and behold, the test passes 👍.

```plaintext
[INFO] -----------------------------------------------
[INFO] BUILD SUCCESS
[INFO] -----------------------------------------------
```

## And obviously that wasn't the solution

Trying to start the whole thing, you are met with the disillusioning realization:

```plaintext
Exception in thread "main" java.lang.IllegalArgumentException: 
LoggerFactory is not a Logback LoggerContext but Logback is on the classpath. 
Either remove Logback or the competing implementation (class org.slf4j.helpers.NOPLoggerFactory loaded from file:/C:/Users/timse/.m2/repository/org/slf4j/slf4j-api/1.7.1/slf4j-api-1.7.1.jar). 
If you are using WebLogic you will need to add 'org.slf4j' to prefer-application-packages in WEB-INF/weblogic.xml: org.slf4j.helpers.NOPLoggerFactory
```

The same error.

Okay, time for analysis:

### Where does slf4j-api dependency originate from?

```bash
$ mvn dependency:tree -Dincludes=org.slf4j:sl4j-api
...
[INFO] --- dependency:3.6.1:tree (default-cli) @ sl4jlogbackerror ---
[INFO] de.timse:reproducingtheslf4jerror:jar:0.0.1-SNAPSHOT
[INFO] \- org.springframework.boot:spring-boot-starter-logging:jar:3.2.0:compile
[INFO]    \- ch.qos.logback:logback-classic:jar:1.4.11:compile
[INFO]       \- org.slf4j:slf4j-api:jar:1.7.1:compile
```

So far, so bad. How can it be that spring-boot-starter-logging brings a dependency that breaks the application?

The spring-boot-starter-logging dependency depends on three libraries:

- logback-classic
- log4j-to-slf4j
- jul-to-slf4j

All of them specify in their parent POM the slf4j-api version **2.0.7**... Wait a minute!

If **2.0.7** is the correct version and there is no other dependency overwriting it, 
then there can only be one person setting it differently ...

![well of course I know him, He's me](./wellIknowhm.webp)

And obviously, in the properties in the POM, happily snuggling between a lot of other configurations, a little fixed version number:

```xml
<properties>
    ...
    <slf4j.version>1.7.1</slf4j.version>
</properties>
```

Time to call it a day!