# angular-app-template
Basic build template for an angular app using gulp and browserify

## Plugin for the POM
```
			<plugin>
				<groupId>com.github.eirslett</groupId>
				<artifactId>frontend-maven-plugin</artifactId>
				<configuration>
					<nodeVersion>${nodeVersion}</nodeVersion>
					<npmVersion>${npmVersion}</npmVersion>
				</configuration>
				<executions>
					<execution>
						<id>clean</id>
						<goals>
							<goal>install-node-and-npm</goal>
							<goal>gulp</goal>
						</goals>
						<phase>clean</phase>
						<configuration>
							<arguments>clean</arguments>
						</configuration>
					</execution>

					<execution>
						<id>npm install</id>
						<goals>
							<goal>npm</goal>
						</goals>

						<!-- optional: default phase is "generate-resources" -->
						<phase>generate-resources</phase>

						<configuration>
							<!-- optional: The default argument is actually "install", so unless 
								you need to run some other npm command, you can remove this whole <configuration> 
								section. -->
							<arguments>install</arguments>
						</configuration>
					</execution>

					<execution>
						<id>build</id>
						<goals>
							<goal>install-node-and-npm</goal>
							<goal>gulp</goal>
						</goals>
						<phase>generate-resources</phase>
						<configuration>
							<arguments>--env=${build.env}</arguments>
						</configuration>
					</execution>
				</executions>
			</plugin>
```
