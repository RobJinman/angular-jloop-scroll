module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
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
        dest: "<%= appbase %>/dist/jlScroll.js",
        src: [
          "<%= appbase %>/src/*.js",
          "<%= appbase %>/src/**/*.js",
        ],
      }
    },
    uglify: {
      target: {
        files: {
          "<%= appbase %>/dist/jlScroll.min.js": ["<%= appbase %>/dist/jlScroll.js"]
        }
      }
    },
    jshint: {
      all: [
        "<%= appbase %>/src/*.js",
        "<%= appbase %>/src/**/*.js",
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
          paths: ["<%= appbase %>/src"],
          outdir: "docs"
        }
      }
    }
  });

  grunt.registerTask("clean", ["shell:cleanDist"]);
  grunt.registerTask("build", ["concat", "uglify:target"]);
  grunt.registerTask("docs", ["yuidoc"]);
  grunt.registerTask("test", ["karma:unit_auto"]);
};
