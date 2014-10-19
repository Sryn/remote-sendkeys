"use strict";angular.module("remoteSendkeysApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngAnimate","ui.scrollfix","LocalStorageModule","ui.sortable","ui.keypress","oitozero.ngSweetAlert","focusOn","keySpy","remoteSendkeysApp.directives"]).config(["$routeProvider","$locationProvider",function(a,b){a.otherwise({redirectTo:"/"}),b.html5Mode(!0).hashPrefix("!")}]).config(["localStorageServiceProvider",function(a){a.setPrefix("open-remote")}]).config(["$logProvider",function(a){a.debugEnabled(!0)}]),angular.module("remoteSendkeysApp").controller("MainCtrl",["$scope","$http","$log","$timeout","$resource","$location","keysArrayStorage","SweetAlert","focus","localStorageService",function(a,b,c,d,e,f,g,h,i,j){var k=!1,l=!1,m=this;m.input="",m.isEditing=!1,m.isWaiting=!1,m.keysArray=g.get(),m.config={},m.config.host=[f.protocol(),"//"+f.host(),f.port()].join(":")+"/",m.config.confirmDelete=!0,j.bind(a,"main.config",m.config),m.clear=function(){m.input="",k&&i("input")},m.sendKeys=function(e){if(e&&!(e.length<1)){var f="sending: "+e;l?(c.debug("mock",f),a.form.input.$message="mock "+f,m.isWaiting=!0,d(function(){c.debug("mock received:",{received:e}),a.form.input.$message="mock server received: "+e,m.isWaiting=!1},3e3)):(c.debug(f),a.form.input.$message=f,m.isWaiting=!0,b.post(m.config.host+"api/sendkeys",{keys:e},{cache:!1}).success(function(b){c.debug("received: ",b),a.form.input.$message="server received: "+b.received,m.isWaiting=!1}).error(function(b,d,e,g){m.isWaiting=!1,c.warn(b,d,e,g),a.form.input.$message=d+" error",f+=b?": "+b.message:""}))}},m.saveKeys=function(a){a&&(m.keysArray.unshift({keys:a}),g.put(m.keysArray))},m.deleteKeys=function(b){var c=m.keysArray.indexOf(b),d=function(){m.keysArray.splice(c,1),g.put(m.keysArray)};m.config.confirmDelete?h.swal({title:"Are you sure?",text:"",type:"warning",showCancelButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes, delete it.",cancelButtonText:"No, cancel.",closeOnConfirm:!0,closeOnCancel:!0},function(b){b&&a.$apply(d)}):d()},m.doneEditingKeys=function(a){function b(a){a.title&&(a.title=a.title.trim()),(""===a.title||a.title===a.keys)&&delete a.title,delete a.$$edit}a?b(a):m.keysArray.forEach(b),g.put(m.keysArray)}}]).factory("keysArrayStorage",["$window","$location","localStorageService",function(a,b,c){function d(){var c=b.hash();return c?(c=a.Base64.decode(c),JSON.parse(c)):null}function e(c){var d="";c.length>0&&(d=angular.toJson(c,!1),d=a.Base64.encodeURI(d)),b.hash(d).replace()}return{get:function(){var a=d()||c.get("keys")||[];return e(a),a},put:function(a){e(a),c.set("keys",a)}}}]),angular.module("remoteSendkeysApp").config(["$routeProvider",function(a){a.when("/",{templateUrl:"app/main/main.html",controller:"MainCtrl as main",reloadOnSearch:!1})}]),angular.module("remoteSendkeysApp.directives",[]).directive("ngRightClick",["$parse",function(a){return function(b,c,d){var e=a(d.ngRightClick);c.bind("contextmenu",function(a){b.$apply(function(){a.preventDefault(),e(b,{$event:a})})})}}]).directive("flash",["$timeout","$animate",function(a,b){return function(c,d,e){var f;c.$watch(e.flash,function(){b.removeClass(d,"ng-hide","ng-hide-animate"),a.cancel(f),f=a(function(){b.addClass(d,"ng-hide","ng-hide-animate")},2e3)})}}]),angular.module("keySpy",[]).factory("keySpy",function(){var a={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"delete"};return function(b){var c=[];b.shiftKey&&16!==b.keyCode&&c.push("shift"),b.altKey&&18!==b.keyCode&&c.push("alt"),b.ctrlKey&&17!==b.keyCode&&c.push("ctrl"),b.metaKey&&c.push("meta");var d=b.keyCode;return"keypress"===b.type&&b.keyCode>32&&(d=String.fromCharCode(d),b.shiftKey||(d=d.toLowerCase())),d=a[b.keyCode]||d,c.push(d),c.join("-")}}).directive("keySpy",["keySpy","$log",function(a,b){return{restrict:"A",link:function(c,d,e){var f=e.keySpy||"keyup keydown keypress";d.bind(f,function(c){b.debug(c.type+":",a(c),c.keyCode)})}}}]),angular.module("remoteSendkeysApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.menu=[],a.isCollapsed=!0,a.isActive=function(a){return a===b.path()}}]),angular.module("remoteSendkeysApp").run(["$templateCache",function(a){a.put("app/main/main.html",'<!-- div ng-include="\'components/navbar/navbar.html\'"></div --><header class="hero-unit affix" id=banner ui-scrollfix=10><div class=container><!-- div class="logo">\n      <!-- img src="assets/images/cab60926.yeoman.png" alt="I\'m Yeoman" --><!-- i class="fa fa-keyboard-o fa-6"></i>\n    </div --><h1 ui-scrollfix=170><i class="fa fa-keyboard-o fa-6"></i> <span>remote-sendkeys</span></h1><p class=lead>Send keystrokes to your PC using node server and angular client</p></div></header><div id=content class=container><form class="row top-buffer-20" name=form><div class=input-group><input class="form-control input-lg" name=input ng-model=main.input focus-on=input key-spy="keypress keydown keyup"> <span class=input-group-btn><button class="btn btn-lg btn-primary" ng-click="main.sendKeys(main.input); main.clear();" ng-disabled=!main.input.length title=Send><i class="glyphicon glyphicon-send"></i></button> <button class="btn btn-lg btn-default" ng-click="main.saveKeys(main.input); main.clear();" ng-disabled=!main.input.length title="Save for later"><i class="glyphicon glyphicon-paperclip"></i></button></span></div><!-- label class="small text-left col-md-6"><input type="checkbox" ng-model="main.immediate"> Send keys while typing</label --><div class="small text-right text-success col-md-6">&nbsp; <span class="status ng-hide" flash=form.input.$message>{{form.input.$message}}</span></div></form><div class="row top-buffer-5"><form class="form-horizontal col-xs-10" role=form ng-show=main.isEditing><div class=form-group><label for=ip class="col-sm-2 control-label">Host:</label><div class=col-sm-10><input name=ip class=form-control ng-model="main.config.host"></div></div><div class=form-group><div class="col-sm-offset-2 col-sm-10"><div class=checkbox><label><input type=checkbox ng-model=main.config.confirmDelete> Confirm delete</label></div></div></div></form><div class="col-xs-2 pull-right"><button class="btn btn-sm pull-right" ng-click="main.isEditing = !main.isEditing; main.doneEditingKeys();" ng-class="{active: main.isEditing}"><i class="glyphicon glyphicon-cog"></i></button></div></div><div class="row top-buffer-5" ui-sortable ng-model=main.keysArray><div class="top-buffer-5 clip-item col-sm-6 col-xs-12" ng-repeat="keys in main.keysArray track by $index" ng-init="edit = false"><div ng-hide="main.isEditing || keys.$$edit"><button type=button class="btn btn-default btn-xlg btn-block" ng-click="main.sendKeys(keys.keys); main.clear();" ng-right-click="keys.$$edit = true" ng-attr-title={{keys.keys}} ng-disabled=main.isWaiting>{{keys.title || keys.keys}}</button> <!-- div class="input-group-btn">\n            <button type="button" class="btn btn-lg btn-default" ng-click="keys.$$edit = true">\n              <span>&#8942;</span>\n              <span class="sr-only">Toggle Edit</span>\n            </button>\n          </div --></div><form name=edit class="edit row" ng-show="main.isEditing || keys.$$edit"><!-- span class="grip glyphicon glyphicon-move"></span --><div class=item-grip><span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></div><div class=col-xs-12><div class=form-group><input name=title class="form-control input-top" placeholder=title ng-model=keys.title ui-keyup="{\'esc\':\'main.doneEditingKeys(keys)\'}"></div><div class=form-group><input name=keys class="form-control input-bottom" placeholder=keys ng-model=keys.keys ui-keyup="{\'esc\':\'main.doneEditingKeys(keys)\'}"></div><div class="form-group pull-right"><button class="btn btn btn-default" title=delete ng-click=main.deleteKeys(keys)><i class="glyphicon glyphicon-remove"></i></button> <button class="btn btn btn-primary" title=edit ng-click=main.doneEditingKeys(keys) ng-show=keys.$$edit><i class="glyphicon glyphicon-ok"></i></button></div></div></form></div></div></div><!-- button type="button" class="btn btn-default btn-lg btn-block" ng-click="main.sendKeys(\'{RCTRL down}{F1}{RCTRL up}\')">God mode</button>\n<button type="button" class="btn btn-default btn-lg btn-block" ng-click="main.sendKeys(\'{RCTRL down}{NUMPAD1}{RCTRL up}\')">Fix car</button>\n<button type="button" class="btn btn-default btn-lg btn-block" ng-click="main.sendKeys(\'{F10 down}{NUMPAD4}{F10 up}\')">Teleport to safehouse</button>\n<button type="button" class="btn btn-default btn-lg btn-block" ng-click="main.sendKeys(\'{RCTRL down}m{RCTRL up}\')">Teleport to dest</button>\n<button type="button" class="btn btn-default btn-lg btn-block" ng-click="main.sendKeys(\'{RCTRL down}m{RCTRL up}\')">Hello</button --><footer class=footer><div class=container><i class="fa fa-github"></i><p><a href="https://github.com/Hypercubed/open-remote/">GitHub Project</a> | <a href="https://github.com/Hypercubed/open-remote/issues?state=open">Issues</a></p></div></footer>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-fixed-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>open-remote</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li></ul><ul class="nav navbar-nav navbar-right"><!-- li ng-class="{active: main.isEditing}">\n          <a class="btn"\n            ng-click="main.isEditing = !main.isEditing; main.doneEditingKeys();"\n            ng-class="{active: main.isEditing}">\n            <i class="glyphicon glyphicon-cog"></i>\n          </a>\n        </li --></ul></div></div></div>')}]);