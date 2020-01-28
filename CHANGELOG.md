## 1.0.0-beta18
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Tue Jan 28 14:34:02 CET 2019

### Bugfixes
* Error: this.api.deleteRelation is not a function 


## 1.0.0-beta17
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Tue Dec 03 17:02:02 CET 2019

### Bugfixes
* create --from-template=xy does only work with core.v1 prefix

### Features
* Processes include estimated time of how long a process might take
* Processes include progress information


## 1.0.0-beta16
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Wed Sep 25 12:04:02 CEST 2019

* CORE: [CHANGE] Handle StreamErrors during stream responses


## 1.0.0-beta15
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Thu Aug 16 10:59:03 CEST 2019

* CORE: [CHANGE] Removed ramac borders, the list output is now a borderless table which is more compact
* CORE: [FIX] Fixed log exception output due a beta api change in the tubee api
* CORE: [CHANGE] Changed reverse sorting if using -t to use an indexed query instead $natural sorting.
* CORE: [FIX] TypeError: Cannot read property 'split' of undefined with get and no resource type #13
* CORE: [FIX] Do not print out resources if the list is empty while multiple resource types are fetched
* CORE: [FIX] Error: Required parameter collection was null or undefined when calling getEndpoints #12
* CORE: [FEATURE] Print process status during process following and exit after process is finished
* CORE: [FEATURE] Implement rollback command #14
 

## 1.0.0-beta14
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Tue Jul 09 11:28:03 CEST 2019

* CORE: [FEATURE] Support for MicrosoftGraph endpoint


## 1.0.0-beta13
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Thu June 20 15:46:03 CEST 2019

* PACKAGING: [CHANGE] Moved windows build from appveyor to travis


## 1.0.0-beta12
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri June 07 12:03:03 CEST 2019

* CORE: [FIX] removed watch debug to stdout
* CORE: [FIX] multi resource alias dor instead re


## 1.0.0-beta11
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri June 07 12:03:03 CEST 2019

* CORE: [CHANGE] apply can now handle List resources
* CORE: [FEATURE] Export and import multiple resources #7


## 1.0.0-beta10
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Thu May 23 09:39:03 CEST 2019

* CORE: [FIX] sync --simulate works now correctly 
* CORE: [FIX] apply new AccessRule now correcly adds the new resource without error


## 1.0.0-beta9
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Wed May 22 14:09:03 CEST 2019

* CORE: [CHANGE] nexe downgrade due fs.readFileSync error (openapi.yml not found)


## 1.0.0-beta8
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri May 10 09:52:03 CEST 2019

* CORE: [CHANGE] If --debug was applied and an exception occured during login operation the exception gets dumped to stdout
* CORE: [FEATURE] Added possibility to use < > <= >= in a query operation
* CORE: [FIX] sync operation with query


## 1.0.0-beta7
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri May 10 09:52:03 CEST 2019

* CORE: [FIX] removed debug output if request ended in error (use --debug)
* CORE: [CHANGE] process time is now in a humanreadable format instead seconds
* CORE: [FIX] --tail/-t works now correctly 
* CORE: [CHANGE] shortcut for --trace is now -T instead -t
* CORE: [CHANGE] --logs now includes the option -t (tail)
* CORE: [FEATURE] Added count/total resources after list and log output
* CORE: [FEATURE] Support for multiple context (use --context to specify a different one)
* CORE: [CHANGE] config can now be edited using `tubectl edit config`
* CORE: [FEATURE] Added --query/-q and --json-query to the sync command (Only sync specific objects)


## 1.0.0-beta6
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri Apr 05 16:51:01 CEST 2019

* CORE: [CHANGE] removed users command alias
* CORE: [CHANGE] command alias for access-roles is now aro
* CORE: [CHANGE] command alias for access-rules is now aru
* CORE: [CHANGE] command alias for relations is now dor
* CORE: [FEATURE] added sync job command
* CORE: [CHANGE] The default of 100 objects was set down to 20 if --limit was not specified
* CORE: [CHANGE] if --trace is applied for the sync command, --follow is not required anymore
* CORE: [FIX] --trace for sync follow


## 1.0.0-beta5
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Wed Apr 03 16:02:01 CEST 2019

* CORE: [FIX] secret resource alias is now correctly `se` instead duplicate of ar.
* CORE: [FIX] added missing command alias for edit access-rules
* CORE: [FIX] #TypeError: this.api.createAccessRule is not a function
* CORE: [FIX] fixed double name attribute if name has been specified in command line and -t has been used
* CORE: [FIX] login password prompt now hides password correctly and login works
* CORE: [FIX] log output gets ignored if --logs is specified without a propper resource name


## 1.0.0-beta4
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Wed Mar 27 09:13:14 CET 2019

* PACKAGING: [FEATURE] Added chocolately package
* PACKAGING: [CHANGE] Automatically update homebrew formula after release
* CORE: [CHANGE] https:// may now be left out during login operation
* CORE: [FIX] --debug prints now requests during login operation
* CORE: [FIX] fixed Cannot read property 'DefaultApi' of undefined during login
* CORE: [FIX] Packaged with openapi v3 instead swagger v2


## 1.0.0-beta3
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri Mar 15 15:18:12 CET 2019

* CORE: [CHANGE] explain now uses the OpenAPIv3 spec provided from tubee-sdk-node
* CORE: [CHANGE] explain includes oneOf and required 
* CORE: [CHANGE] create --from-template also uses the OpenAPIv3 spec now 
* CORE: [FIX] Missing workflow arguments (collection/endpoint) now display the help page instead "(node:27089) UnhandledPromiseRejectionWarning: Error: Required parameter endpoint was null or undefined when calling getWorkflows."
* CORE: [FEATURE] added support for GarbageWorkflow resources
* CORE: [FIX] ignore empty resources in apply operation
* CORE: [CHANGE] better error handling for resource which are either invalid or have not been found
* CORE: [FEATURE] detect duplicate resources in apply operation (prints a warning and ignores duplicates)
* CORE: [CHANGE] --diff now compares to the last version by default. Optionally one can set a specific version.
* CORE: [CHANGE] shorthand command name for relations is now or (object relation) insteadof re
* CORE: [FIX] remove watch if set on endpoint-objects
* CORE: [CHANGE] exclude readOnly attributes from template processor
* CORE: [CHANGE] added readonly hint in explain if field is readOnly
* CORE: [FIX] Fixed --follow after exec a sync operation


## 1.0.0-beta2
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Thu Feb 07 16:59:12 CET 2019

beta release v1.0.0-beta2


## 1.0.0-beta1
**Maintainer**: Raffael Sahli <sahli@gyselroth.com>\
**Date**: Fri Jan 25 17:18:12 CET 2019

Initial beta release v1.0.0-beta1
