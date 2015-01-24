var consolidate = require("consolidate");
var _ = require("lodash");
var path = require("path");
var through = require("through2");

function basicCompileData(globals, file) {
  return _.extend(globals, file);
}

function templates(options) {
  var globals = options.globals || {};

  var compileData = options.compileData || basicCompileData;

  if (!options.engine) {
    throw new Error("Missing required `engine` parameter");
  }

  return through.obj(function (file, enc, callback) {
    var templateName = file.frontMatter.template || "post";

    var templatePath = path.join(__dirname, templateName + ".html");

    var data = compileData(globals, file);

    consolidate[options.engine](templatePath, data, function (err, html) {
      if (err) {
        throw err;
      }

      file.contents = new Buffer(html, "utf-8");

      callback(null, file);
    });
  });
}

module.exports = templates;
