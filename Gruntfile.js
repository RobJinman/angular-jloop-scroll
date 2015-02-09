module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-karma");
  grunt.loadNpmTasks("grunt-shell");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-yuidoc");

  grunt.initConfig({
    appbase: ".",
    pkg: grunt.file.readJSON("package.json"),
    banner: "/*!\n" +
            " * <%= pkg.name %>\n" +
            " * @author <%= pkg.author %>\n" +
            " * @version <%= pkg.version %>\n" +
            " * Copyright <%= pkg.copyright %>\n" +
            " */\n",
    shell: {
      cleanDist: {
        command: "rm -R dist/*"
      }
    },
    concat: {
      scripts: {
        options: {
          separator: ";"
        },
        dest: "<%= appbase %>/js/app-compiled.js",
        src: [
          "<%= appbase %>/js/dev/*.js",
          "<%= appbase %>/js/dev/**/*.js",
        ],
      }
    },
    jshint: {
      all: [
        "<%= appbase %>/js/dev/*.js",
        "<%= appbase %>/js/dev/**/*.js",
      ]
    },
    karma: {
      unit: {
        configFile: "test/karma-unit.conf.js",
        autoWatch: false,
        singleRun: true
      },
      unit_auto: {
        configFile: "test/karma-unit.conf.js",
        autoWatch: true,
        singleRun: false
      }
    },
    yuidoc: {
      all: {
        name: "<%= pkg.name %>",
        description: "<%= pkg.description %>",
        version: "<%= pkg.version %>",
        url: "<%= pkg.homepage %>",
        options: {
          paths: ["<%= appbase %>/js/dev"],
          outdir: "docs"
        }
      }
    }
  });

  grunt.registerTask("clean", ["shell:cleanDist"]);
  grunt.registerTask("build", ["sass:dev", "concat"]);
  grunt.registerTask("docs", ["yuidoc"]);
  grunt.registerTask("test", ["karma:unit_auto"]);
};
