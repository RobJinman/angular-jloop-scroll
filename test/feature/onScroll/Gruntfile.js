module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-contrib-connect");

  grunt.initConfig({
    connect: {
      options: {
        base: "../../../"
      },
      webserver: {
        options: {
          hostname: '',
          port: 9999,
          keepalive: true
        }
      }
    }
  });

  grunt.registerTask("run", ["connect:webserver"]);
};
