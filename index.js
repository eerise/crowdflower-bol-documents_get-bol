exports.handler = (event, context, cb) => {
console.log(JSON.stringify(event));

'use strict';

var AWS = require ("aws-sdk");
var async = require ("async");

AWS.config.update ({region: 'us-west-2'});

var s3 = new AWS.S3 ();
var bucket = process.env.bucketName;

async.waterfall ([
    //check if BOL exists in casestack-bol-documents bucket
    function CheckBolExists (next) {
        var key = "CrowdFlower BOLs Identified/" + event.po_number.trim() + ".pdf";
        s3.headObject ({
            Bucket: bucket,
            Key: key
        }, function (err, data) {
            if (err)
                next (null, null);
            else {
                next (null, key);
            }
        })
    },
    //retrieve BOL URL if found in bucket
    function RetrieveBolUrl (key, next) {
        if (key == null) {
            next (null, null);
        }
        else {
            s3.getSignedUrl ('getObject', {
                Bucket: bucket,
                Key: key,
                Expires: 3600
            }, function (err, url) {
                if (err)
                    next (err, null);
                else {
                    console.log(url)
                    next (null, url);
                }
            })
        }
    }
], function (err, url) {
    if (err)
        cb (err, null);
    else {
        cb (null, url);
    }
})}
