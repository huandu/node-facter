# facter - A wrapper for puppet `facter` tool #

[Facter](https://puppetlabs.com/facter) is a command line tool to gather information about a system. This node module is to wrap calls to `facter` command and return results as a javascript object.

It's very straight forward to use this module.

```javascript
var facter = require("facter");

// Get one fact.
facter.query("fqdn", function(err, facts) {
    console.log(facts.fqdn);
});

// Get a list of facts.
facter.query(["ipaddress", "fqdn"], function(err, facts) {
    console.log(facts.ipaddress);
    console.log(facts.fqdn);
});
```

## License ##

This module is licensed under the MIT license that can be found in the LICENSE file.
