    var abFunctions = function() {
        //global this save
        var gThis = this;
        // check if a string is json
        this.IsJsonString = function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };
        Array.prototype.unique = function() {
    var unique = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.indexOf(this[i]) == -1) {
            unique.push(this[i]);
        }
    }
    return unique;
};
        // unique name for array object with name parameter
        this.uniqueName = function(origName, entireArray, k, elem) {
            k = (typeof k !== 'undefined' ? k : 1); //optional parameter. Default 1
            elem = (typeof elem !== 'undefined' ? elem : 'name'); //optional parameter. Default name
            //temporary new name
            var tempName = (origName + k).toString();
            var result = tempName;
            //loop entire array to check for new name if it exists
            entireArray.forEach(function(arr, i) {
                // if new name exists, search for next one
                if (tempName == arr[elem]) {
                    k++;
                    result = gThis.uniqueName(origName, entireArray, k, elem);
                }
            });
            //if new name was not found, return it
            return result;
        };
        //swap items from given array
        this.swapItems = function(tArray, a, b) {
            var varA = tArray[a];
            var varB = tArray[b];
            tArray[a] = varB;
            tArray[b] = varA;
            return tArray;
        };
        this.isJsonString = function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        //External simple variables:
        this.aBMainOrig = function() {
            var tempObj = {
                menus: [{
                        label: 'Posts',
                        type: 'post',
                        name: 'posts',
                        unique: true,
                        children: []
                    }, {
                        label: 'Pages',
                        type: 'page',
                        name: 'pages',
                        unique: true,
                        children: []
                    },
                    {
                        label: 'Sidebars',
                        type: 'sidebars',
                        name: 'sidebars',
                        unique: true,
                        pageTitle: 'Custom Sidebar',
                        pageDescription: 'Custom Sidebar Description',
                        capability: 'manage_options',
                        handler: 'ab_menu_handler',
                        children: [],
                    },
                    {
                        label: 'Rest Routes',
                        type: 'restRoutes',
                        name: 'restRoutes',
                        unique: true,
                        children: [],
                    },
                    // {
                    //     label: 'Dashboard Widgets',
                    //     type: 'dWidgets',
                    //     name: 'dWidgets',
                    //     unique: true,
                    //     children: [],
                    // },
                    // {
                    //     label: 'Taxonomies',
                    //     type: 'taxonomies',
                    //     name: 'taxonomies',
                    //     unique: true,
                    //     children: [],
                    // }
                    // {
                    //     label: 'Widgets',
                    //     type: 'widgets',
                    //     name: 'widgets',
                    //     unique: true,
                    //     pageTitle: 'Custom Widget',
                    //     pageDescription: 'Custom widget Description',
                    //     capability: 'manage_options',
                    //     handler: 'ab_menu_handler',
                    //     children: [],
                    // },{
                    //     label: 'Taxonomies',
                    //     type: 'toaxonomies',
                    //     name: 'taxonomies',
                    //     unique: true,
                    //     pageTitle: 'Custom Taxonomy',
                    //     pageDescription: 'Custom Taxonomy Description',
                    //     capability: 'manage_options',
                    //     handler: 'ab_menu_handler',
                    //     children: [],
                    // },{
                    //     label: 'TinyMCE Buttons',
                    //     type: 'tinyMCE',
                    //     name: 'tinyMCE',
                    //     unique: true,
                    //     pageTitle: 'Custom TinyMCE Buttons',
                    //     pageDescription: 'Custom TinyMCE Button Description',
                    //     capability: 'manage_options',
                    //     handler: 'ab_menu_handler',
                    //     children: [],
                    // }
                ]
            };
            return tempObj;
        };

        this.downloadInnerFile = function(filename, elId, jsonString, exportType) {
            var elHtml1 = document.getElementById(elId + '1').innerHTML;
            var link = document.createElement('a');
            mimeType = 'text' || 'text/plain';
            jsonString = jsonString.replace(/'/g, "\\'");
            jsonString = jsonString.slice(1, jsonString.length - 1);

            var funcString = '\n    $theJson = \'' + jsonString + '\';';
            elHtml = '<?php \n ';
            elHtml += '    $abError = false;\n';
            elHtml += '    include_once ABSPATH.\'wp-admin/includes/plugin.php\';\n';
            elHtml += '    if (!is_plugin_active(\'admin-builder/admin-builder.php\')) {\n';
            elHtml += '      if(!function_exists(\'sample_admin_notice__success\'))\n';
            elHtml += '           {\n';
            elHtml += '        function sample_admin_notice__success()\n';
            elHtml += '        {\n';
            elHtml += '          $pluginInstalled = false;\n';
            elHtml += '          if (!function_exists(\'get_plugins\')) {\n';
            elHtml += '            require_once ABSPATH.\'wp-admin/includes/plugin.php\';\n';
            elHtml += '          }\n';
            elHtml += '          $allPlugins = get_plugins();\n';
            elHtml += '          foreach ($allPlugins as $key => $value) {\n';
            elHtml += '            if ($key === \'admin-builder/admin_builder.php\') {\n';
            elHtml += '              $pluginInstalled = true;\n';
            elHtml += '            }\n';
            elHtml += '           }\n';
            elHtml += '            if ($pluginInstalled){\n';
            elHtml += '              if (!is_plugin_active(\'admin-builder/admin_builder.php\')) {\n';
            elHtml += '                $abError = true;\n';
            elHtml += '                $url = admin_url();\n';
            elHtml += '                echo \'<div class="notice notice-error is-dismissible">\';\n';
            elHtml += '                echo \'<h3>Admin Builder Plugin is not ACTIVE!</h3>\';\n';
            elHtml += '                echo \'<p>\';\n';
            elHtml += '                echo \'To get the full functionality , activate Admin Builder from the <a href="\'.$url.\'/plugins.php">plugins directory</a>.\';\n';
            elHtml += '                echo \'</p>\';\n';
            elHtml += '                echo \'</div>\';\n';
            elHtml += '              } else {\n';
            elHtml += '                $theJson = \'\';\n';
            elHtml += '              }\n';
            elHtml += '             } else {\n';
            elHtml += '              $abError = true;\n';
            elHtml += '              echo \'<div class="notice notice-error is-dismissible">\';\n';
            elHtml += '              echo \'<h3>Admin Builder Plugin is not installed!</h3>\';\n';
            elHtml += '              echo \'<p>\';\n';
            elHtml += '              echo \'To get the full functionality , install Admin Builder.\';\n';
            elHtml += '              echo \'</p>\';\n';
            elHtml += '              echo \'<p>\';\n';
            elHtml += '              $plugin_name = \'admin-builder\';\n';
            elHtml += '              $install_link = \'<a href="\'.esc_url(network_admin_url(\'plugin-install.php?tab=plugin-information&amp;plugin=\'.$plugin_name.\'&amp;TB_iframe=true&amp;width=600&amp;height=550\')).\'" class="thickbox" title="More info about \'.$plugin_name.\'">Install \'.$plugin_name.\'</a>\';\n';
            elHtml += '              echo $install_link;\n';
            elHtml += '              echo \'</p>\';\n';
            elHtml += '              echo \'</div>\';\n';
            elHtml += '             }\n';
            elHtml += '            }\n';
            elHtml += '            add_action(\'admin_notices\', \'sample_admin_notice__success\');\n';
            elHtml += '           }\n';
            elHtml += '           }\n';
            elHtml += '           if (!$abError) {\n';

            if (exportType === 'theme') {
                elHtml += '    $pathToSource = realpath(dirname(__FILE__));\n';
                elHtml += '    if (strpos($pathToSource, \'themes\') !== false) {\n';
                //theme
                elHtml += '        $my_theme = wp_get_theme();\n';
                elHtml += '        $themeData[\'Version\'] = $my_theme->get( \'Version\' );\n';
                elHtml += '        $themeData[\'Name\'] = $my_theme->get( \'Name\' );\n';
                elHtml += '    }';
            }
            elHtml += elHtml1 + funcString + '\n';

            elHtml += 'if(class_exists(\'generalFunctionality\')){\n';
            elHtml += '    $abGeneral = new generalFunctionality();\n';
            if (exportType === 'plugin') {
                elHtml += '    $abGeneral->loadNew($theJson,$plugin_folder[$plugin_file]);\n';
            }
            if (exportType === 'theme') {
                elHtml += '    $abGeneral->loadNew($theJson,$themeData);\n';
            }
            elHtml += '    }\n';
            elHtml += '   }\n';

            elHtml = unescape(elHtml);
            elHtml = elHtml.replace('&gt;', ">");
            elHtml = elHtml.replace('&gt;', ">");
            elHtml = elHtml.replace('||if1||', "if(isset($_GET['action']) && $_GET['action']==='install-plugin' && isset($_GET['plugin']) && $_GET['plugin']==='admin-builder'){return;}");

            link.setAttribute('download', filename);
            link.setAttribute('href', 'data:' + 'text;data:attachment/php;charset=utf-8,' + encodeURIComponent(elHtml));
            // window.open("text;data:attachment/php;charset=utf-8," + encodeURIComponent(elHtml));
            link.click();
        };

    };
    var OpenInNewTab = function(url) {
        var win = window.open(url, '_blank');
        win.focus();
    };
    var stripslashes = function(str) {
        //       discuss at: http://locutus.io/php/stripslashes/
        //      original by: Kevin van Zonneveld (http://kvz.io)
        //      improved by: Ates Goral (http://magnetiq.com)
        //      improved by: marrtins
        //      improved by: rezna
        //         fixed by: Mick@el
        //      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
        //      bugfixed by: Brett Zamir (http://brett-zamir.me)
        //         input by: Rick Waldron
        //         input by: Brant Messenger (http://www.brantmessenger.com/)
        // reimplemented by: Brett Zamir (http://brett-zamir.me)
        //        example 1: stripslashes('Kevin\'s code')
        //        returns 1: "Kevin's code"
        //        example 2: stripslashes('Kevin\\\'s code')
        //        returns 2: "Kevin\'s code"

        return (str + '').replace(/\\(.?)/g, function(s, n1) {
            switch (n1) {
                case '\\':
                    return '\\';
                case '0':
                    return '\u0000';
                case '':
                    return '';
                default:
                    return n1;
            }
        });
    };
    //notification message when reloading, exiting that changes are not saved
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";

      (e || window.event).returnValue = confirmationMessage; //Gecko + IE
      return confirmationMessage;                            //Webkit, Safari, Chrome
    });
