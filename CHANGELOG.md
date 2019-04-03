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
