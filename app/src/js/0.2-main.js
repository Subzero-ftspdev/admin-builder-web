(function() {
    var abFunc = new abFunctions();

    //debug variable
    var debug = false;
    //The main module
    var aB = angular.module('aBMain', ['ui.bootstrap', 'ngAnimate', 'ngStorage', 'ngRoute']);
    aB.run(function($rootScope, $templateCache) {
        $rootScope.$on('$viewContentLoaded', function() {
            $templateCache.removeAll();
        });
    });
    if (debug) {
        console.log('Module aBMain initiated');
    }
    //directives
    aB.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });
    // directives end


    //
    //routes start
    //
    aB.config(function($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: 'templates/login.html',

            })
            .when('/login', {
                templateUrl: 'templates/login.html',
            })
            .when('/projects', {
                templateUrl: 'templates/projects.html',
            })
            .when('/project/:id', {
                templateUrl: 'templates/content.html',
            })
            .when('/export', {
                templateUrl: 'templates/export.html'
            })
            .when('/register', {
                templateUrl: 'templates/register.html',
            })
            .when('/newProject', {
                templateUrl: 'templates/newProject.html',
            })
            .when('/editProject/:id', {
                templateUrl: 'templates/editProject.html',
            })
            .when('/editProject', {
                templateUrl: 'templates/newProject.html'
            })
            .when('/resetPassword', {
                templateUrl: 'templates/resetPassword.html',
            })
            .when('/account', {
                templateUrl: 'templates/account.html',
            })
            .when('/contact', {
                templateUrl: 'templates/contact.html',
            })
            .when('/terms-and-conditions', {
                templateUrl: 'templates/terms-and-conditions.html',
            })
            .otherwise({
                redirectTo: '/',
            });
    });




    ////
    ////
    ////
    //// route Functions END
    ////
    ////
    ////

    var mainCtrl = aB.controller('mainCtrl', ['$scope', '$log', '$http', '$localStorage', '$httpParamSerializerJQLike', '$location', '$routeParams', function($scope, $log, $http, $localStorage, $httpParamSerializerJQLike, $location, $routeParams) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        if (debug) {
            $log.log('mainCtrl controller  initiated');
        }
        //set all the variables to the scope

        $scope.isCollapsed = true;
        $scope.codeCollapsed = true;
        $scope.isFieldCollapsed = true;
        //default variable declaration
        $scope.eShow = false;
        $scope.menuEditSettShow = false;
        $scope.selMI = undefined;
        $scope.fieldModel = 'default';
        $scope.mBoxSett = false;
        $scope.mboxFields = true;
        $scope.aBIE = 'Json goes here';
        $scope.alerts = [];
        $scope.contentTemplate = '';
        $scope.headerTemplate = '';
        $scope.rUName = '';
        $scope.menuAdd = 'default';
        $scope.metaboxText = 'Metabox';
        $scope.rootPath = '';
        $scope.loadingOverlay = false;

        //product data:
        $scope.pTitle = '';
        $scope.pDescription = '';

        // login data
        $scope.lEmail = '';
        $scope.testResponse = '';
        $scope.regexMail = /(^\s*$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:[a-zA-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$)/;
        $scope.regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        $scope.lEmailBool = true;
        $scope.lPassword = '';
        $scope.lPassword2 = '';
        $scope.strongPassword = '';
        $scope.vHeader = false;

        //containers
        $scope.mainContainer = 'templates/metaboxContainer-0.1.5.html';
        $scope.abExtraEditFields = '';
        $scope.aBMain = new abFunc.aBMainOrig();

        //projects vars
        $scope.pEdit = false;
        $scope.projectID = null;
        $scope.userProjects = [];
        $scope.pEditID = null;

        //account data :
        $scope.uEmail = '';
        $scope.familyName = '';
        $scope.givenName = '';
        $scope.website = '';
        $scope.shortBio = '';

        $scope.expirationDate = '00/00/000';

        //when location changes
        $scope.$on('$locationChangeStart', function(event) {
            var tempPath = $location.path();
            if (debug) {
                console.log(tempPath.indexOf('/projects'));
            }
            switch (true) {
                case tempPath.indexOf('/login') != -1:
                case $location.path() == '/':
                    $scope.vToken('ftlLogin', '/login');
                    break;
                case tempPath.indexOf('/projects') != -1:
                    $scope.eShow = false;
                    $scope.vToken('ftlAllProjects', '/login');
                    break;
                case tempPath.indexOf("/editProject/") != -1: //edit a specific project
                    $scope.vToken('ftlEditProject', '/login');
                    break;
                case tempPath.indexOf("/project/") != -1: //load a specific project
                    $scope.vToken('ftlLoadProject', '/login');
                    break;
                case tempPath.indexOf("/account") != -1: //account page
                    $scope.eShow = false;
                    $scope.vToken('ftlAccount', '/login');
                    break;
                case tempPath.indexOf("/contact") != -1: //account page
                    $scope.vToken('ftlContact', '/login');
                    break;
                case tempPath.indexOf("/splash") != -1: //account page
                    document.location = 'http://admin-builder.com/splash';
                    break;
            }
        });
        $scope.abGoTo = function(urlPath) {
            $location.path(urlPath);
        };
        $scope.isloggedIn = function() {

            if ($localStorage.loginToken) {
                return true;
            }
            return false;
        };

        $scope.contentSwitch = function(boolVar) {
            $scope.eShow = boolVar;
            if (boolVar) {
                $scope.aBIE = JSON.stringify($scope.aBMain);
                $scope.saveSettings();
                $location.path('export');
            } else {
                $location.path('projects');
            }

            // by default show the editor
            if (debug) {
                console.log($scope.contentTemplate);
            }
        };
        $scope.setMenu = function(index, menu) {
            $scope.selMI = index;
            if (debug) {
                console.log('Menu type: ' + menu.label);
            }
            switch (menu.type) {
                case 'cPage':
                    $scope.mBoxSett = false;
                    $scope.mboxFields = true;
                    $scope.metaboxText = 'Tab';
                    //add tab for general content if array length  of children of selected menu is 0
                    if (menu.children.length === 0) {
                        $scope.addMetabox(menu);
                    }
                    if (menu.children.length === 1) {
                        $scope.isCollapsed = false;
                    }
                    $scope.abExtraEditFields = '';

                    break;
                case 'widgets':
                    $scope.metaboxText = 'Widget';
                    $scope.mBoxSett = false;
                    $scope.mboxFields = true;
                    $scope.abExtraEditFields = '';

                    break;
                case 'sidebars':
                    $scope.metaboxText = 'Sidebar';
                    $scope.mBoxSett = true;
                    $scope.mboxFields = false;
                    $scope.abExtraEditFields = 'templates/sidebarsEdit-0.0.4.html';
                    break;
                case 'taxonomies':
                    $scope.metaboxText = 'Taxonomy';
                    $scope.mBoxSett = false;
                    $scope.mboxFields = true;
                    $scope.abExtraEditFields = 'templates/taxonomies-0.0.1.html';

                    break;
                case 'tinyMCE':
                    $scope.metaboxText = 'Button';
                    $scope.mBoxSett = false;
                    $scope.mboxFields = true;
                    $scope.abExtraEditFields = '';
                    break;
                case 'restRoutes':
                    $scope.metaboxText = 'Route';
                    $scope.mBoxSett = true;
                    $scope.mboxFields = false;
                    $scope.isCollapsed = true;
                    $scope.mboxFields = false;
                    $scope.abExtraEditFields = 'templates/restRoutes-0.0.5.html';
                    break;
                case 'customizer':
                    $scope.mBoxSett = false;
                    $scope.mboxFields = true;
                    $scope.metaboxText = 'Panel';
                    //add tab for general content if array length  of children of selected menu is 0
                    if (menu.children.length === 0) {
                        $scope.addMetabox(menu);
                    }
                    if (menu.children.length === 1) {
                        $scope.isCollapsed = false;
                    }
                    $scope.abExtraEditFields = '';
                    $scope.fieldOptions = $scope.customizerFieldOptions;

                    break;
                case 'dWidgets':
                    $scope.metaboxText = 'Widget';
                    $scope.mBoxSett = true;
                    $scope.mboxFields = false;
                    $scope.abExtraEditFields = 'templates/dashboardWidgets-0.0.1.html';

                    break;
                default:
                    $scope.mBoxSett = false;
                    $scope.mboxFields = true;
                    $scope.isCollapsed = true;
                    $scope.metaboxText = 'Metabox';
                    $scope.abExtraEditFields = '';
                    break;
            }
            $scope.mainContainer = 'templates/metaboxContainer-0.1.5.html';
            $scope.menuEditSettShow = false;
        };
        $scope.isMenu = function(index) {
            if ($scope.selMI === index) {
                return true;
            }
            return false;
        };

        $scope.removeMe = function(tArr, i, allArray) { //paramaters: temporary array as the array, index to remove
            allArray = (typeof allArray !== "undefined" ? allArray : null);
            tArr.splice(i, 1);
            //if menu item is cPage , expand the only item remaining
            if (allArray !== null && allArray.type === 'cPage' && allArray.children.length === 1) {
                $scope.isCollapsed = false;
            }
        };
        $scope.addMetabox = function(tArr) {
            $scope.isCollapsed = true;
            var defMetaBox = {
                label: 'Metabox',
                name: 'metabox',
                context: 'normal',
                priority: 'default',
                fields: []
            };
            //settings to set for individual "metabox" archive array parameters
            switch (tArr.type) {
                case 'cPage':
                    defMetaBox.label = 'Tab';
                    defMetaBox.name = 'tab';
                    break;
                case 'widgets':
                    defMetaBox.label = 'Widget';
                    defMetaBox.name = 'widget';
                    break;
                case 'sidebars':
                    defMetaBox.label = 'Sidebar';
                    defMetaBox.name = 'sidebar';
                    defMetaBox.description = 'Default Description for sidebar';
                    defMetaBox.before_widget_id = '%1$s';
                    defMetaBox.before_widget_class = 'widget %2$s';
                    defMetaBox.before_title_class = 'widgettitle';
                    break;
                case 'taxonomies':
                    defMetaBox.label = 'Taxonomy';
                    defMetaBox.name = 'taxonomy';
                    break;
                case 'tinyMCE':
                    defMetaBox.label = 'Sidebar';
                    defMetaBox.name = 'sidebar';
                    break;
                case 'restRoutes':
                    defMetaBox.label = 'Route';
                    defMetaBox.name = 'route';
                    defMetaBox.rRMethod = 'post';
                    defMetaBox.override = false;
                    defMetaBox.namespace = abFunc.uniqueName(defMetaBox.name, tArr.children) + 'Namespace';
                    defMetaBox.route_path = '/' + abFunc.uniqueName(defMetaBox.name, tArr.children) + 'Route';
                    defMetaBox.callbackFunction = 'callback_' + abFunc.uniqueName(defMetaBox.name, tArr.children);
                    break;
                case 'customizer':
                    defMetaBox.label = 'Panel';
                    defMetaBox.name = 'panel';

                    break;
                case 'dWidgets':
                    defMetaBox.label = 'Widget';
                    defMetaBox.name = 'widget';
                    break;

            }
            defMetaBox.name = abFunc.uniqueName(defMetaBox.name, tArr.children);
            defMetaBox.label = abFunc.uniqueName(defMetaBox.label, tArr.children, 1, 'label');
            tArr.children.push(defMetaBox);
            if (debug) {
                console.log('metabox added!');
            }
        };
        //reorder the array indexes
        $scope.movePosition = function(tArr, index, direction) {
            var oIndex = index; // original index
            var aLength = tArr.length;
            if (direction === 'up') {
                if (index > 0) {
                    index--;
                } else {
                    index = aLength - 1;
                }
            } else if (direction === 'down') {
                if (index < aLength - 1) {
                    index++;
                } else {
                    index = 0;
                }
            }
            tArr = abFunc.swapItems(tArr, oIndex, index);
        };
        //add a new field to the mix
        $scope.addField = function(tArr, fieldModel) {
            var newField = {};
            // forEach
            $scope.fieldOptions.forEach(function(arr, i) {
                if (arr.type === fieldModel) {
                    newField = {
                        name: arr.name,
                        type: arr.type,
                        label: arr.label,
                        description: arr.description,
                    };
                    //
                    // All the custom variables for each object
                    //
                    //if it's a select type present, add it to the new object array
                    if (arr.selectType) {
                        newField.selectType = arr.selectType;
                    }
                    //if it's a Option array present, add it
                    if (arr.oArr) {
                        newField.oArr = [];
                    }
                    //if it's a radioType array present, add it
                    if (arr.radioType) {
                        newField.radioType = arr.radioType;
                    }
                    //if it's a orientation array present, add it
                    if (arr.orientation) {
                        newField.orientation = arr.orientation;
                    }
                    //if it's a date format array present, add it
                    if (arr.format) {
                        newField.format = arr.format;
                    }
                    //if there's opacity variable present, add it
                    if (arr.opacity) {
                        newField.opacity = arr.opacity;
                    }
                    //if there's opacity variable present, add it
                    if (arr.tSizes) {
                        newField.tSizes = arr.tSizes;
                    }
                    if (arr.extraText) {
                        newField.extraText = arr.extraText;
                    }

                }
            });

            //unique values
            newField.name = abFunc.uniqueName(newField.name, tArr);
            newField.label = abFunc.uniqueName(newField.label, tArr, 1, 'label');
            tArr.push(newField);

            if (debug) {
                console.log('Field ' + newField.name + ' added!');
                console.log('Field data:');
                console.log(newField);
            }
            //reset select model to default value
            this.fieldModel = 'default';
        };

        //hide or show region based on field type or custom field object array value
        $scope.showHideField = function(field, type, typeVar) {
            typeVar = (typeof typeVar !== 'undefined' ? typeVar : 'type'); //default is type
            if (field[typeVar] == type) {
                return true;
            }
            return false;
        };
        // add dynamic option
        $scope.aBAddOption = function(tArr) {
            var newOption = {
                label: '',
                value: ''
            };
            if (typeof tArr !== 'undefined') {
                tArr.push(newOption);
            }
        };
        // add dynamic option
        $scope.aBAddOptionSize = function(tArr) {
            var newOption = {
                width: '',
                height: '',
            };
            if (typeof tArr !== 'undefined') {
                tArr.push(newOption);
            }
        };
        //Save settings in cookie
        $scope.saveSettings = function(showAlert) {
            showAlert = (typeof showAlert !== "undefined" ? showAlert : true);
            if ($scope.projectID !== null) {
                $scope.loadingOverlay = true;
                var postData = {
                    'abToken': $localStorage.loginToken,
                    'pJson': JSON.stringify($scope.aBMain),
                    'pID': $scope.projectID,
                };
                $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $httpParamSerializerJQLike(postData),
                    url: $scope.rootPath + '/wp-json/ab/updateProjectJson',
                }).then(function successCallback(response) {
                    $scope.loadingOverlay = false;
                    var status = response.data.status;
                    var tokenIsValid = response.data.tokenIsValid;

                    if (tokenIsValid) {
                        if (showAlert) {
                            swal({
                                allowOutsideClick: true,
                                title: "Saved!",
                                type: "success",
                                text: status,
                                timer: 1000,
                                showConfirmButton: false
                            });

                        }
                    } else {
                        if (showAlert) {
                            swal({
                                allowOutsideClick: true,
                                title: "Error!",
                                type: "error",
                                text: status,
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }
                    }
                }, function errorCallback(response) {
                    $scope.loadingOverlay = false;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    return false;
                });

                // updateProjectJson
                var cookieStr = JSON.stringify($scope.aBMain);
                // $localStorage.abMain = cookieStr;
                if (showAlert) {
                    swal({
                        allowOutsideClick: true,
                        title: "Saved!",
                        type: "success",
                        text: 'Save Succesfull!',
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }

        };

        // clear everyhing
        $scope.aBClear = function() {
            $scope.aBMain = new abFunc.aBMainOrig();
            $scope.aBIE = JSON.stringify($scope.aBMain);
            $localStorage.aBMain = $scope.aBIE;

            swal({
                allowOutsideClick: true,
                title: "Cleared!",
                type: "success",
                text: 'Everything Cleared!',
                timer: 1000,
                showConfirmButton: false
            });

        };
        $scope.activatePage = function(urlPath) {
            $scope.contentTemplate = urlPath;
            $scope.eShow = false;
        };
        //first loadSettings
        $scope.radioOrientation = [{
            value: 'h',
            label: 'Horizontal',
        }, {
            value: 'v',
            label: 'Vertical',
        }];

        // custom || categories || tags ||taxonomies || posts || pages || cpts || sidebars || widgets

        $scope.addMainMenu = function() {
            var tThis = this;
            this.extraMenus.forEach(function(item) {
                var newItem = {};
                newItem = {
                    label: item.label,
                    type: item.type,
                    name: item.name,
                    unique: item.unique,
                    children: [],
                };

                if (item.args) {
                    newItem.args = item.args;
                }

                if (item.capability) {
                    newItem.capability = item.capability;
                }
                if (item.handler) {
                    newItem.handler = item.handler;
                    newItem.handler = abFunc.uniqueName(newItem.handler, $scope.aBMain.menus, 1, 'handler');
                }
                if (item.pageTitle) {
                    newItem.pageTitle = item.pageTitle;
                    newItem.pageTitle = abFunc.uniqueName(newItem.pageTitle, $scope.aBMain.menus, 1, 'pageTitle');
                }
                newItem.name = abFunc.uniqueName(newItem.name, $scope.aBMain.menus);
                newItem.label = abFunc.uniqueName(newItem.label, $scope.aBMain.menus, 1, 'label');

                if (item.type === tThis.menuAdd) {
                    $scope.aBMain.menus.push(newItem);
                    return;
                }
            });
            this.menuAdd = 'default';
        };
        $scope.showEditSettings = function(index) {
            if (index !== undefined && typeof $scope.aBMain.menus[index]!== "undefined") {
                    return !$scope.aBMain.menus[index].unique;
            }
            return false;
        };
        $scope.editMainSettings = function(index) {
            if ($scope.menuEditSettShow) {
                $scope.mainContainer = 'templates/metaboxContainer-0.1.5.html';
            } else {
                $scope.mainContainer = 'templates/menuSettings.html';
            }
            $scope.menuEditSettShow = !$scope.menuEditSettShow;
        };
        $scope.abRemoveArr = function(xArr, index) {
            xArr.splice(index, 1);
        };
        $scope.abRemoveCPT = function(xArr, index) {
            $scope.abRemoveArr(xArr, index);
            $scope.menuEditSettShow = !$scope.menuEditSettShow;
            $scope.mainContainer = 'templates/metaboxContainer-0.1.5.html';
        };
        $scope.singleChild = function(pArr, label) {
            if (pArr.type !== 'cPage') {
                return true;
            }
            return pArr.children.length > 1;
        };
        $scope.dinamicLabel = function(tArr, label) {
            if (tArr.type === 'cPage') {
                if (tArr.children.length === 1) {
                    return 'Single Page Content';
                }
            }
            return label;

        };
        $scope.exportPHP = function(exportType) {
            //http://localhost:8888/wordpress/?pID=102&dType=plugin&download=true
            var downloadURL = $scope.rootPath + '?pID=' + $scope.projectID + '&dType=' + exportType + '&download=true';
            OpenInNewTab(downloadURL);
            //
            // exportArr = JSON.stringify($scope.aBIE);
            // var fileName = 'abExport.php'; // You can use the .txt extension if you want
            // abFunc.downloadInnerFile(fileName, 'phpExport', exportArr, this.exportType);
        };
        $scope.putSource = function(menu, tab, field) {
            var menuType = menu.type;
            var menuName = menu.name;
            var tabName = tab.name;
            var fieldName = field.name;
            var final = '';
            switch (menuType) {
                case 'cPage':
                    //abPage_cPagetab1activateRTA
                    //abOption_cPagetab1activateRTA
                    final = '$' + fieldName + ' = get_option(\'abOption_' + menuType + tabName + fieldName + '\',false);';
                    break;
                default:
                    final = '$' + fieldName + ' = get_post_meta(get_the_ID(),"abMB_' + menuType + tabName + fieldName + '",true);';
                    break;
            }
            return final;
        };
        $scope.editShow = function(index, types) {
            var typesArr = types.split(',');
            var fBool = false;
            typesArr.forEach(function(item, i) {
                if ($scope.aBMain.menus[index].type === item) {
                    fBool = true;
                }
            });
            return fBool;
        };

        //scope variable has value
        $scope.varHasValue = function(variable, value) {
            if (variable == value) {
                return true;
            } else {
                return false;
            }

        };
        Object.toparams = function ObjecttoParams(obj) {
            var p = [];
            for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
        };
        //login functiona;ity
        $scope.abLogin = function() {

            var lEmail = this.lEmail;
            var lPassword = this.lPassword;

            var postData = {
                'lUser': lEmail,
                'lPassword': lPassword
            };
            if (lEmail === '' || lPassword === '') {
                if (lEmail === '') {
                    this.loginForm.loginEmail.$setValidity('unique', false);
                }
                if (lPassword === '') {
                    this.loginForm.loginPassword.$setValidity('unique', false);
                }
                swal({
                    allowOutsideClick: true,
                    title: "Saved!",
                    type: "success",
                    text: 'Please complete the required fields',
                    timer: 1000,
                    showConfirmButton: false
                });
                return true;
            } else {
                $scope.loadingOverlay = true;
                this.projectID = null;
            }
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/Login',
                cache: false,
                // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;

                var fToken = response.data.finalToken;
                var iLogin = response.data.invalidLogin;
                //if login is valid, store the token in local storage
                if (iLogin) {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: 'Username and password not valid, please try again',
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
                //if the login credentials are valid:
                if (!iLogin) {
                    if (debug) {
                        console.log('login credentials are valid!');
                    }
                    //set the login token
                    $localStorage.loginToken = fToken;
                    $scope.vHeader = true;
                    //redirect to projects template
                    $location.path('projects');
                    //change the header template content
                    swal({
                        allowOutsideClick: true,
                        title: "Logged in",
                        type: "success",
                        text: 'succesfully logged in!',
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                $scope.vHeader = false;
                $scope.loadingOverlay = false;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.validatePass = function(type) {
            type = (typeof type !== "undefined" ? type : true);

            var lPassword = this.lPassword;
            var lPassword2 = this.lPassword2;
            if (debug) {
                console.log(lPassword + '-' + lPassword2);
            }
            if (lPassword === lPassword2) {
                if (type) {
                    if (this.registerForm) {
                        this.registerForm.$setValidity('unique', true);
                        this.registerForm.lPassword.$setValidity('unique', true);
                        this.registerForm.lPassword2.$setValidity('unique', true);
                    }
                } else {
                    if (this.resetPassword) {
                        this.resetPassword.$setValidity('unique', true);
                        this.resetPassword.lPassword.$setValidity('unique', true);
                        this.resetPassword.lPassword2.$setValidity('unique', true);
                    }
                }

                return true;
            } else {
                if (type) {
                    if (this.registerForm) {
                        this.registerForm.lPassword.$setValidity('unique', false);
                        this.registerForm.lPassword2.$setValidity('unique', false);
                        this.registerForm.$setValidity('unique', false);
                    }
                } else {
                    if (this.resetPassword) {
                        this.resetPassword.lPassword.$setValidity('unique', false);
                        this.resetPassword.lPassword2.$setValidity('unique', false);
                        this.resetPassword.$setValidity('unique', false);
                    }
                }
            }
            return false;
        };
        $scope.validateEmail = function() {
            if (debug) {
                console.log($scope.lEmail.valid);
            }
            return false;

        };
        $scope.changeValidity = function(tObj) {
            tObj.$setValidity('unique', true);
        };
        //register a new user to the system
        $scope.abRegister = function() {
            var emailNotEmpty = this.lEmail.length === 0 ? false : true;
            if (!emailNotEmpty) {
                this.registerForm.lEmail.$setValidity('unique', false);
            } else {
                this.registerForm.lEmail.$setValidity('unique', true);
            }
            var passNotEmpty = this.lPassword.length === 0 ? false : true;
            if (!passNotEmpty) {
                this.registerForm.lPassword.$setValidity('unique', false);
                this.registerForm.lPassword2.$setValidity('unique', false);
            }
            if (this.registerForm.lEmail.$valid && this.registerForm.lPassword.$valid && this.registerForm.lPassword2.$valid) {
                this.registerForm.$setValidity('unique', true);

            }
            if (debug) {
                console.log(this.registerForm.$valid);
                console.log(this.registerForm.$valid + '-' + emailNotEmpty + '-' + passNotEmpty);
                console.log('Email Valid:' + this.registerForm.lEmail.$valid);
                console.log('Pass Valid:' + this.registerForm.lPassword.$valid);
                console.log('Pass2 Valid:' + this.registerForm.lPassword2.$valid);
            }


            if (this.registerForm.$valid && emailNotEmpty && passNotEmpty) {
                //send the registration request here

                //****************************
                //****************************
                var lEmail = this.lEmail;
                var lPassword = this.lPassword;
                $scope.loadingOverlay = true;
                var postData = {
                    'lUser': lEmail,
                    'lPassword': lPassword
                };

                $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $httpParamSerializerJQLike(postData),
                    url: $scope.rootPath + '/wp-json/ab/Register',
                    cache: false,
                    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).then(function successCallback(response) {
                    $scope.loadingOverlay = false;
                    var status = response.data.status;
                    var error = response.data.error;
                    if (status) {
                        $scope.contentTemplate = 'templates/login-0.1.4.html';
                        //populate fields with data:
                        $scope.lEmail = lEmail;
                        $scope.lPassword = lPassword;
                        $scope.abLogin();

                        // populate fields end

                        // run login function

                    }
                    if (error) {
                        swal({
                            allowOutsideClick: true,
                            title: "Error",
                            type: "error",
                            text: error,
                            timer: 1000,
                            showConfirmButton: false
                        });

                    }

                }, function errorCallback(response) {
                    $scope.loadingOverlay = false;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
                //***********************************************
                //***********************************************
                //***********************************************
                //***********************************************
                //***********************************************
                return true;
            }
            //return error message that form is not valid
            swal({
                allowOutsideClick: true,
                title: "Error",
                type: "error",
                text: 'Form does not validate! Please make sure the email and passwords are validating. Password needs to be strong. letters, numbers and special characters.[0-9],[a-z], [!@#\$%\^&\*] min 8 characters. Or generate random Password',
                timer: 4000,
                showConfirmButton: false
            });
            return false;
        };
        $scope.logOut = function() {
            //save current project settings
            $scope.saveSettings(false);
            //clear all the variables
            delete $localStorage.loginToken;
            $scope.projectID = null;
            $scope.vHeader = false;
            $location.path('login');
        };
        $scope.abResetPassword = function() {
            //
            // IF field does not validate
            //
            var validate = true;
            if (this.lEmail === '' || !this.resetPassword.lEmail.$valid) {
                this.resetPassword.lEmail.$setValidity('unique', false);
                validate = false;
            }
            if (!this.resetPassword.lPassword.$valid || !this.resetPassword.lPassword2.$valid || this.lPassword === '') {
                this.resetPassword.lPassword.$setValidity('unique', false);
                this.resetPassword.lPassword2.$setValidity('unique', false);
                validate = false;
            }
            var newPassword = false;
            if (!validate) {
                swal({
                    allowOutsideClick: true,
                    title: "Invalid Form!",
                    type: "error",
                    text: 'Form does not validate. Make sure the passwords match and the email is of correct format',
                    timer: 1000,
                    showConfirmButton: false
                });
                return false;
            } else {
                newPassword = (typeof this.lPassword !== "undefined" ? this.lPassword : false);
            }
            //
            // IF field validates
            //

            $scope.loadingOverlay = true;
            var postData = {
                'lEmail': this.lEmail
            };
            if (newPassword !== false) {
                postData.newPassword = newPassword;
            }

            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/resetPassword',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;

                var validity = response.data.validity;
                var status = response.data.status;

                if (validity) {
                    swal({
                        allowOutsideClick: true,
                        title: "Success!",
                        type: "success",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });
        };
        //generate strong pasword
        $scope.generatePassword = function() {
            var pLen = 2;
            charset = 'abcdefghijklmnopqrstuvwxyz';
            charsetB = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';
            charsetC = '123456789';
            charsetD = '!@#\$%\^&\*';

            retVal = '';
            for (var i = 0; i < pLen; ++i) {
                var n = charset.length;
                retVal += charset.charAt(Math.floor(Math.random() * n));
                n = charsetB.length;
                retVal += charsetB.charAt(Math.floor(Math.random() * n));
                n = charsetC.length;
                retVal += charsetC.charAt(Math.floor(Math.random() * n));
                n = charsetD.length;
                retVal += charsetD.charAt(Math.floor(Math.random() * n));
            }
            this.lPassword = retVal;
            this.lPassword2 = retVal;
            this.strongPassword = retVal;

            this.registerForm.lPassword.$setValidity('unique', true);
            this.registerForm.lPassword2.$setValidity('unique', true);

            return retVal;

        };
        //Validate token functiona;ity
        $scope.vToken = function(functionName, redirectPath) {
            if ($localStorage.loginToken === null) {
                if (debug) {
                    console.log('loginToken is null');
                }
                return false;
            }
            $scope.loadingOverlay = true;
            var postData = {
                'abToken': $localStorage.loginToken
            };
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/validateToken',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;
                var tokenReturn = response.data;
                if (tokenReturn) {
                    if (debug) {
                        console.log('*token is valid*');
                        console.log('Accesing function ' + functionName);
                    }
                    runFunction(functionName);
                } else {
                    if (debug) {
                        console.log('*token NOT valid*');
                        console.log('Going to path: ' + redirectPath);
                    }
                    $location.path(redirectPath);
                }
            }, function errorCallback(response) {
                $location.path(redirectPath);
            });
        };
        var runFunction = function(functionName) {
            switch (functionName) {
                case 'ftlLogin':
                    $scope.ftlLogin();
                    break;
                case 'ftlAllProjects':
                    $scope.ftlAllProjects();
                    break;
                case 'ftlEditProject':
                    $scope.ftlEditProject();
                    break;
                case 'ftlLoadProject':
                    $scope.ftlLoadProject();
                    break;
                case 'ftlAccount':
                    $scope.ftlAccount();
                    break;
                case 'ftlContact':
                    $scope.ftlContact();
                    break;
                case 'ftltermsAndConditions':
                    $scope.ftltermsAndConditions();
                    break;

            }
        };
        //
        //
        //Create new project - rest request
        //
        //
        $scope.createNewProject = function(alertShow) {
          $scope.aBClear();
          $scope.aBMain = new abFunc.aBMainOrig();
            alertShow = (typeof alertShow !== "undefined" ? alertShow : false);

            $scope.pEdit = false;
            delete $scope.pEditID;
            if (this.newProjectName === '' && this.newProjectForm) {
                this.newProjectForm.newProjectName.$setValidity('unique', false);

                return false;
            }
            $scope.loadingOverlay = true;

            var newJson = JSON.stringify($scope.aBMain);
            var postData = {
                'pName': this.newProjectName,
                'type': 'new',
                'pDesc': this.newProjectDescription,
                'jsonSetting': newJson,
                'abToken': $localStorage.loginToken
            };
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/addProject',
            }).then(function successCallback(response) {
                $scope.aBMain = new abFunc.aBMainOrig();
                $scope.loadingOverlay = false;

                var status = response.data.status;
                var pAdded = response.data.pAdded;
                var pID = response.data.pID;
                if (debug) {
                    console.log('Project was added? : ' + pAdded);
                }
                if (pAdded) {
                    $scope.aBMain = new abFunc.aBMainOrig();
                    $scope.projectID = pID;
                    $scope.aBMain = new abFunc.aBMainOrig();
                    $location.path('project/' + pID);
                    if (alertShow) {
                        swal({
                            allowOutsideClick: true,
                            title: "Project Created!",
                            type: "success",
                            text: status,
                            timer: 1000,
                            showConfirmButton: false
                        });
                    }
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;

                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });

        };

        //First init projects
        $scope.ftlAllProjects = function() {
            $scope.vHeader = true;
            $scope.openProjects();


        };
        //acount page initialization
        $scope.ftlAccount = function(alertShow) {
            alertShow = (typeof alertShow !== "undefined" ? alertShow : false);
            $scope.vHeader = true;



            var postData = {
                'abToken': $localStorage.loginToken
            };
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/getAccountData',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;
                var status = response.data.status;
                var fStatus = response.data.fStatus;
                var uID = response.data.uID;


                var uEmail = response.data.uEmail;
                var familyName = response.data.familyName;
                var givenName = response.data.givenName;
                var website = response.data.website;
                var shortBio = response.data.shortBio;


                if (debug) {
                    console.log('Account data returned successfully ');
                }
                if (fStatus) {
                    $scope.familyName = familyName;
                    $scope.givenName = givenName;
                    $scope.website = website;
                    $scope.shortBio = shortBio;
                    $scope.uEmail = uEmail;
                    if (alertShow) {
                        swal({
                            allowOutsideClick: true,
                            title: "Account Data Loaded",
                            type: "success",
                            text: status,
                            timer: 1000,
                            showConfirmButton: false
                        });
                    }
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;

                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });


        };
        //
        //contact page function functionality
        //
        $scope.ftlContact = function() {
            $scope.vHeader = true;

        };

        $scope.ftltermsAndConditions = function() {
            $scope.vHeader = true;

        };
        $scope.updateAccount = function() {
            $scope.vHeader = true;



            var postData = {
                'abToken': $localStorage.loginToken,
                'familyName': this.familyName,
                'givenName': this.givenName,
                'website': this.website,
                'shortBio': this.shortBio,
            };
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/updateAccountData',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;
                var status = response.data.status;
                var fStatus = response.data.fStatus;
                if (fStatus) {
                    if (debug) {
                        console.log('Account data updated successfully ');
                    }
                    swal({
                        allowOutsideClick: true,
                        title: "Account Updated",
                        type: "success",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;

                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });

        };
        //submit contact form
        $scope.sendContact = function() {
            if (debug) {
                console.log('trying to send contact form');
            }

            $scope.vHeader = true;



            var postData = {
                'abToken': $localStorage.loginToken,
                'cSubject': this.cSubject,
                'cMessage': this.cMessage,
            };
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/sendContactForm',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;
                var status = response.data.status;
                var fStatus = response.data.fStatus;
                if (fStatus) {
                    if (debug) {
                        console.log('Account data updated successfully ');
                    }
                    swal({
                        allowOutsideClick: true,
                        title: "Message Sent!",
                        type: "success",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                    $scope.abGoTo('account');
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;

                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });
        };
        // go to contact page
        $scope.contactCall = function() {
            $scope.abGoTo('contact');
        };
        $scope.accResPass = function() {
            var uEmail = $scope.uEmail;
            $location.path('resetPassword');
            $scope.lEmail = uEmail;
        };
        // load a project
        $scope.ftlLoadProject = function() {
            //show the header
            $scope.aBMain = new abFunc.aBMainOrig();
            $scope.vHeader = true;
            //other stuff
            $scope.loadProject();
        };
        //first initialize edit a project
        $scope.ftlEditProject = function() {

            //show the header
            $scope.vHeader = true;
            //other stuff
            var pID = $routeParams.id;
            $scope.editProject(pID);

        };
        //load a specific project to the view
        $scope.loadProject = function(alertShow) {
            //if no alertShow parameter is set, the default is false
            alertShow = (typeof alertShow !== "undefined" ? alertShow : false);
            var pID = $routeParams.id;
            $scope.selMI = null; //clear the selected menu item

            //save previous project settings
            $scope.projectID = pID;
            $scope.loadingOverlay = true;

            var postData = {
                'abToken': $localStorage.loginToken,
                'pID': pID,
            };
            if (debug) {}
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/loadProject',
            }).then(function successCallback(response) {
                if (debug) {
                    console.log('loadProject Response:');
                    console.log(response);
                }
                $scope.loadingOverlay = false;

                var status = response.data.status;
                var tokenIsValid = response.data.tokenIsValid;
                var pJson = response.data.pJson;

                if (tokenIsValid) {
                    if (debug) {
                        console.log('Project ID:' + pID + ' Loaded');
                    }
                    // if (alertShow) {
                    //     swal({
                    //         allowOutsideClick: true,
                    //         title: "Success!",
                    //         type: "success",
                    //         text: status,
                    //         timer: 1000,
                    //         showConfirmButton: false
                    //     });
                    // }
                    $scope.aBMain = JSON.parse(pJson);
                    if (debug) {
                        console.log($scope.aBMain);
                    }
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;

                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });
        };
        $scope.abCompareProjects = function(pID) {
            if (this.projectID === pID) {
                return true;
            }
            return false;

        };

        $scope.openProjects = function(alertShow) {
            alertShow = (typeof alertShow !== "undefined" ? alertShow : false);

            $scope.loadingOverlay = true;

            var postData = {
                'abToken': $localStorage.loginToken
            };
            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/projectsList',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;

                var status = response.data.status;
                var userProjects = response.data.projects;
                if (debug) {
                    console.log('user Projects:');
                    console.log(userProjects);
                }
                $scope.userProjects = userProjects;
                if (status) {
                    if (alertShow) {
                        swal({
                            allowOutsideClick: true,
                            title: "Projects Opened!",
                            type: "success",
                            text: status,
                            timer: 1000,
                            showConfirmButton: false
                        });
                    }
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });
        };

        $scope.newProjectTemplate = function() {
            $scope.newProjectName = '';
            $scope.newProjectDescription = '';
            $scope.pEdit = false;
            $location.path('newProject');
        };
        //
        // deleteing A project functionality
        //
        $scope.deleteProject = function(alertShow, pIDObj) {
            alertShow = (typeof alertShow !== "undefined" ? alertShow : false);

            var pID = (typeof pIDObj !== "undefined" ? pIDObj : $scope.pEditID);
            if (pID !== null) {
                // send the request to delete the project
                if (debug) {
                    console.log('deleting ' + pID);
                }
                $scope.loadingOverlay = true;
                var postData = {
                    'abToken': $localStorage.loginToken,
                    'pID': pID
                };
                $http({
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: $httpParamSerializerJQLike(postData),
                    url: $scope.rootPath + '/wp-json/ab/deleteProject',
                }).then(function successCallback(response) {
                    $scope.loadingOverlay = false;

                    var status = response.data.status;
                    var tokenIsValid = response.data.tokenIsValid;
                    var fStatus = response.data.fStatus;
                    if (fStatus) {
                        if (alertShow) {
                            swal({
                                allowOutsideClick: true,
                                title: "Project Deleted!",
                                type: "success",
                                text: status,
                                timer: 1000,
                                showConfirmButton: false
                            });
                        }
                    } else {
                        swal({
                            allowOutsideClick: true,
                            title: "Error Deleting Project!",
                            type: "error",
                            text: status,
                            timer: 1000,
                            showConfirmButton: false
                        });
                    }
                    $scope.ftlAllProjects();
                }, function errorCallback(response) {
                    $scope.loadingOverlay = false;
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    return false;
                });

            }

        };
        $scope.editProject = function(pID) {
            //request to load project data
            $scope.pEdit = true;
            $scope.pEditID = pID;
            //request project data
            $scope.loadingOverlay = true;
            var postData = {
                'abToken': $localStorage.loginToken,
                'pID': pID,
            };

            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/loadProject',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;
                var status = response.data.status;
                var tokenIsValid = response.data.tokenIsValid;
                var pTitle = response.data.pTitle;
                var pDescr = response.data.pDescr;
                if (debug) {
                    console.log(pTitle);
                }
                if (tokenIsValid) {
                    $scope.newProjectName = pTitle;
                    $scope.newProjectDescription = pDescr;

                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                return false;
            });
        };
        $scope.updateProject = function() {
            var pID = $routeParams.id;
            if (debug) {
                console.log($scope.pEditID);
            }
            $scope.loadingOverlay = true;

            var postData = {
                'abToken': $localStorage.loginToken,
                'pID': $scope.pEditID,
                'pTitle': this.newProjectName,
                'pDescr': this.newProjectDescription,
            };

            $http({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: $httpParamSerializerJQLike(postData),
                url: $scope.rootPath + '/wp-json/ab/updateProjectInfo',
            }).then(function successCallback(response) {
                $scope.loadingOverlay = false;

                var status = response.data.status;
                var tokenIsValid = response.data.tokenIsValid;
                if (tokenIsValid) {
                    swal({
                        allowOutsideClick: true,
                        title: "Project Updated!",
                        type: "success",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                    $scope.abGoTo('project/' + pID);
                } else {
                    swal({
                        allowOutsideClick: true,
                        title: "Error Updating Project!",
                        type: "error",
                        text: status,
                        timer: 1000,
                        showConfirmButton: false
                    });
                }
            }, function errorCallback(response) {
                $scope.loadingOverlay = false;
                // called asynchronously if an error occurslo
                // or server returns response with an error status.
                return false;
            });

        };

        //general functions
        $scope.isInPath = function(path) {
            var tempPath = $location.path();
            if (tempPath.indexOf(path) !== -1) {
                return true;
            }
            return false;
        };





        //
        // routes callbacks
        //

        // if login route is loaded and token is valid:
        $scope.ftlLogin = function() {
            $scope.vHeader = true;
            $location.path('projects');
        };

        //variables
        //**************************
        $scope.fieldOptionsOriginal = [{
                type: 'default',
                label: 'Select a Field to add',
            }, {
                type: 'textbox',
                name: 'textbox',
                label: 'TextBox',
                description: 'Default TextBox Description text',
            }, {
                type: 'textarea',
                name: 'textarea',
                label: 'TextArea',
                description: 'Default TextArea Description text',
            }, {
                type: 'select',
                name: 'select',
                label: 'Select',
                description: 'Default Select Description text',
                selectType: 'custom', // custom || categories || tags ||taxonomies || posts || pages || cpts || sidebars || widgets
                oArr: [], // value && label arrays
            }, {
                type: 'radio',
                name: 'radio',
                label: 'Radio Buttons',
                description: 'Default Radio Buttons Description text',
                orientation: 'h', //horizontal || vertical (how to display the fields in wordpress)
                radioType: 'custom', // custom || categories || tags ||taxonomies || posts || pages || cpts || sidebars || widgets
                oArr: [], // label arrays
            }, {
                type: 'checkbox',
                name: 'checkbox',
                label: 'Checkbox',
                description: 'Default checkbox Description text',
                extraText: 'the text that goes at the right of the checkbox',
            }, {
                type: 'datepicker',
                name: 'datepicker',
                label: 'Datepicker',
                description: 'Default datepicker Description text',
                format: 'mm/dd/YY'
            }, {
                type: 'timepicker',
                name: 'timepicker',
                label: 'Timepicker',
                description: 'Default timepicker Description text',
                format: 'H:i:s'
            }, {
                type: 'colorpicker',
                name: 'colorpicker',
                label: 'Colorpicker',
                description: 'Default colorpicker Description text',
                format: 'hex', // hex,rgba
                opacity: true // allow user to modify opacity? true || false. Default true
            }, {
                type: 'upload',
                name: 'upload',
                label: 'Media Upload',
                description: 'Default Media Upload Description text',
                tSizes: []
            }, {
                type: 'bootstrapIcons',
                name: 'bootstrapIcons',
                label: 'BootStrap Icons',
                description: 'Default Bootstrap Icons Description text',
                tSizes: []
            },
            // {
            //     type: 'textboxesDynamic',
            //     name: 'textboxesDynamic',
            //     label: 'Dynamic Textboxes',
            //     description: 'Infinite custom textboxes',
            //     oArr: [], // label arrays
            // }
        ];
        $scope.customizerFieldOptions = [{
            type: 'default',
            label: 'Select a Field to add',
        }, {
            type: 'text',
            name: 'Textbox',
            label: 'Textbox',
            description: 'Simple default TextBox',
        }, {
            type: 'color',
            name: 'color',
            label: 'Color Picker',
        }, {
            type: 'upload',
            name: 'upload',
            label: 'Media upload Button',
        }, {
            type: 'textarea',
            name: 'textarea',
            label: 'Textarea',
        }, {
            type: 'dropdown-pages',
            name: 'dropdown-pages',
            label: 'Dropdown pages',
        }];
        // customizer specific fields
        $scope.fieldOptions = $scope.fieldOptionsOriginal;
        $scope.mBContext = [{
            value: 'normal',
            label: 'Normal'
        }, {
            value: 'side',
            label: 'Side'
        }];
        $scope.mBPriority = [{
            value: 'default',
            label: 'Default'
        }, {
            value: 'high',
            label: 'High'
        }, {
            value: 'low',
            label: 'Low',
        }];
        $scope.rRMethods = [{
            value: 'get',
            label: 'GET'
        }, {
            value: 'post',
            label: 'POST'
        }];
        $scope.selectTypes = [{
                value: 'custom',
                label: 'Custom'
            }, {
                value: 'categories',
                label: 'Categories'
            }, {
                value: 'tags',
                label: 'Tags'
            },
            // {
            //   value: 'taxonomies',
            //   label: 'Taxonomies',
            // },
            {
                value: 'posts',
                label: 'Posts'
            }, {
                value: 'pages',
                label: 'Pages'
            }, {
                value: 'users',
                label: 'Users'
            }
            // {
            //   value: 'cpts',
            //   label: 'Custom Post Types',
            // }, {
            //   value: 'sidebars',
            //   label: 'Sidebars',
            // }, {
            //   value: 'widgets',
            //   label: 'Widgets',
            // }
        ];
        $scope.dateFormats = [{
            value: 'mm/dd/YY',
            label: 'mm/dd/YY'
        }, {
            value: 'mm/dd/YYYY',
            label: 'mm/dd/YYYY'
        }, {
            value: 'dd/mm/YY',
            label: 'dd/mm/YY'
        }, {
            value: 'dd/mm/YYYY',
            label: 'dd/mm/YYYY'
        }, {
            value: 'YY/mm/dd',
            label: 'YY/mm/dd'
        }, {
            value: 'YY/dd/mm',
            label: 'YY/dd/mm'
        }, {
            value: 'YYYY/mm/dd',
            label: 'YYYY/mm/dd'
        }, {
            value: 'YYYY/dd/mm',
            label: 'YYYY/dd/mm'
        }];
        $scope.timeFormats = [{
            value: 'H:i:s',
            label: 'H:i:s',
        }, {
            value: 'H-i-s',
            label: 'H-i-s',
        }, {
            value: 'H-i-s',
            label: 'H-i-s',
        }];
        $scope.colorFormats = [{
            value: 'hex',
            label: 'Hexadecimal',
        }, {
            value: 'rgba',
            label: 'RGBA',
        }];
        $scope.extraMenus = [{
                label: 'Select an Option',
                type: 'default',
                name: 'default',
                unique: false,
                children: []
            }, {
                label: 'Custom Post Type',
                type: 'cpt',
                name: 'post_type',
                unique: false,
                children: [],
                args: {
                    label: 'name',
                    labels: '',
                    description: '',
                    public: true,
                    exclude_from_search: true,
                    publicly_queryable: false,
                    show_ui: false,
                    show_in_nav_menus: false,
                    show_in_menu: false,
                    show_in_admin_bar: false,
                    menu_icon: '',
                    capability_type: 'post',
                    capabilities: ['edit_post', 'read_post', 'delete_post', 'edit_others_posts', 'publish_posts', 'read_private_posts', 'read', 'delete_posts', 'delete_private_posts',
                        'delete_published_posts', 'delete_others_posts', 'edit_private_posts', 'edit_published_posts', 'create_posts'
                    ],
                    map_meta_cap: '',
                    hierarchical: false,
                    supports: ['title', 'editor'],
                    register_meta_box_cb: '',
                    taxonomies: '',
                    has_archive: false,
                    permalink_epmask: 'EP_PERMALINK',
                    rewrite: true,
                    query_var: true,
                    can_export: true,
                    show_in_rest: false,
                    rest_controller_class: 'WP_REST_Posts_Controller',
                    _builtin: false
                }
            }, {
                label: 'Admin Page',
                type: 'cPage',
                name: 'cPage',
                unique: false,
                pageTitle: 'Custom Admin Page',
                pageDescription: 'Custom Admin Page Description',
                capability: 'manage_options',
                handler: 'ab_menu_handler',
                children: [],
            },
            // {
            //     label: 'Customizer Panel',
            //     type: 'customizer',
            //     name: 'customizerPanel',
            //     unique: false,
            //     pageTitle: 'Customizer Panel',
            //     pageDescription: 'Customizer Panel Description',
            //     capability: 'manage_options',
            //     handler: 'ab_menu_handler',
            //     children: [],
            // }
        ];
        //initialize on first load
        $scope.loadSettings = function() {

            var abUrl = String(document.location.href);
            if (abUrl.indexOf('localhost') > 0) {
                $scope.rootPath = 'http://localhost:8888/wordpress';

            } else {
                $scope.rootPath = 'http://server.admin-builder.com';
            }
            $scope.eShow = false;
        };
        //initialize some stuff
        $scope.loadSettings();
    }]);
    // Menu Object structure:
    // label - the menu text that's viewable for the user.
    // type - the menu text that's viewable for the user.
    // name - the menu name that's used in the backend. This needs to be unique
    // unique - a bool saying yes if this is supposed to be shown only once or false if it can be infinite
    // children - an array of all the metaboxes .

})();
