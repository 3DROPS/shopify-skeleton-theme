module.exports = function(grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var config = {
    app: 'app',
    dist: 'build',
    env: process.env
  };

  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),

    //////////////////////////////////////////
    // grunt-shopify
    //////////////////////////////////////////
    shopify: {
      options: {
        api_key: config.env.SHOPIFY_KEY,
        password: config.env.SHOPIFY_PASSWORD,
        url: config.env.SHOPIFY_STORE,
        base: "build/"
      }
    },

    //////////////////////////////////////////
    // grunt-modernizr
    //////////////////////////////////////////
    modernizr: {
      devFile: '<%= config.app %>/bower/modernizr/modernizr.js',
      outputFile: '<%= config.dist %>/assets/modernizr.js',
      files: [
        '<%= config.dist %>/assets/{,*/}*.js.liquid',
        '<%= config.dist %>/assets/{,*/}*.css.liquid'
      ],
      uglify: true,
      tests : [
        "css_filters"
      ],
      customTests : [
        '<%= config.app %>/javascripts/modernizr_tests/*.js'
      ]
    },

    //////////////////////////////////////////
    // grunt-contrib-uglify
    //////////////////////////////////////////
    uglify: {
      options: {
        mangle: true,
        compress: true
      },
      app: {
        files: {
          '<%= config.dist %>/assets/store.js.liquid' : [
            '<%= config.app %>/javascripts/main.js'
          ]
        }
      },
    },

    //////////////////////////////////////////
    // grunt-contrib-clean
    //////////////////////////////////////////
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
          ]
        }]
      }
    },

    //////////////////////////////////////////
    // grunt-contrib-compass
    //////////////////////////////////////////
    compass: {
      options: {
        sassDir: '<%= config.app %>/stylesheets',
        cssDir: '.tmp/styles',
        generatedImagesDir: '<%= config.app %>/images',
        noLineComments: true,
        imagesDir: '<%= config.app %>/images',
        javascriptsDir: '<%= config.app %>/javascripts',
        fontsDir: '<%= config.app %>/fonts',
        httpImagesPath: '',
        httpGeneratedImagesPath: '',
        httpFontsPath: '',
        relativeAssets: false,
        outputStyle: 'compressed'
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },


    //////////////////////////////////////////
    // grunt-contrib-copy
    //////////////////////////////////////////
    copy: {
      assets: {
        files: [
          {
            expand: true,
            dot: true,
            flatten: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>/assets',
            src: [
              'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg,ico}',
              'fonts/*.*'
            ]
          },
        ]
      },

      layouts: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: [
              'layout/{,*/}*.liquid'
            ]
          }
        ]
      },

      snippets: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: [
              'snippets/{,*/}*.liquid'
            ]
          }
        ]
      },

      templates: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: [
              'templates/{,*/}*.liquid'
            ]
          }
        ]
      },

      config: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= config.app %>',
            dest: '<%= config.dist %>',
            src: [
              'config/**/*'
            ]
          }
        ]
      },

      styles: {
        files: [
          {
            expand: true,
            dot: true,
            flatten: true,
            cwd: '.tmp',
            dest: '<%= config.dist %>/assets',
            src: [
              'styles/{,*/}*.css'
            ],
            rename: function(dest, src) {
              return dest + '/' + src + '.liquid';
            }
          }
        ]
      }
    },

    //////////////////////////////////////////
    // grunt-contrib-watch
    //////////////////////////////////////////
    watch: {
      compass: {
        files: ['<%= config.app %>/stylesheets/**/*.scss'],
        tasks: ['compass:server']
      },

      copy_assets: {
        files: [
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg,ico}',
          '<%= config.app %>/fonts/{,*/}*.{eot,svg,ttf,woff}'
        ],
        tasks: ['copy:assets']
      },

      copy_layouts: {
        files: '<%= config.app %>/layout/{,*/}*.{liquid, json, html}',
        tasks: ['copy:layouts']
      },

      copy_templates: {
        files: '<%= config.app %>/templates/{,*/}*.{liquid, json, html}',
        tasks: ['copy:templates']
      },

      copy_snippets: {
        files: '<%= config.app %>/snippets/{,*/}*.{liquid, json, html}',
        tasks: ['copy:snippets']
      },

      copy_config: {
        files: '<%= config.app %>/config/**/*',
        tasks: ['copy:config']
      },

      copy_styles: {
        files: '.tmp/styles/{,*/}*.css',
        tasks: ['copy:styles']
      },

      concat: {
        files: ['<%= config.app %>/javascripts/**/*.{hbs,js}'],
        tasks: ['handlebars', 'uglify']
      },

      // From what I could tell from the grunt-shopify src
      // this doesn't actually do anything
      shopify: {
        files: ['<%= config.dist %>/**/*'],
        tasks: ['shopify']
      }
    }
  });

  grunt.registerTask('build', [
    'clean',
    'compass:server',
    'uglify',
    'modernizr',
    'copy',
  ]);

  grunt.registerTask('deploy', [
    'build',
    'shopify:upload'
  ]);

  grunt.registerTask('develop', [
    'build',
    'watch'
  ]);

};
