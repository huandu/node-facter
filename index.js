"use strict";

var _ = require("underscore");
var debug = require("debug")("facter");
var spawn = require("child_process").spawn;

/**
 * Query facts from puppet `facter` command line.
 *
 * Sample:
 *     var facter = require("facter");
 *     facter.query("fqdn", function(err, facts) {
 *         console.log(facts.fqdn);
 *     });
 *     facter.query(["ipaddress", "fqdn"], function(err, facts) {
 *         console.log(facts.ipaddress);
 *         console.log(facts.fqdn);
 *     });
 *
 * @param {String|Array} facts A fact name or an array of fact names.
 * @param {Function} cb function(err, results)
 */
exports.query = function(facts, cb) {
    if (!Array.isArray(facts)) {
        facts = [facts];
    }

    // Filter invalid input.
    var re = /^[0-9a-z][0-9a-z_-]*$/i;
    var argv = ["facter", "--json"];
    argv.push.apply(argv, facts.filter(function(fact) {
        return re.test(fact);
    }));

    var output = "";
    var facter = spawn("/usr/bin/env", argv);
    facter.stdout.on("data", function(data) {
        output += data;
    });
    facter.on("close", function(code) {
        if (code) {
            debug("fail to call facter. [code:%d] [cmd:%s %s]", code, argv.join(" "));
            cb(new Error("fail to call facter"));
            return;
        }

        try {
            var parsed = JSON.parse(output);
            var results = {};

            _.each(facts, function(fact) {
                results[fact] = parsed[fact] || null;
            });

            cb(null, results);
        } catch (e) {
            debug("fail to parse facter output. [output:%s] [cmd:%s]", output, argv.join(" "));
            cb(new Error("fail to parse facter output"));
        }
    });
};
