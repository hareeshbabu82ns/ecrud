angular.module('archanaApp.directives', []);

angular.module('archanaApp.directives')
  .factory('elementIdGen', function () {
    var generator = function () {
      this.idNum = 0;
      this.generate = function () {
        this.idNum = this.idNum + 1;
        return 'hele_' + this.idNum;
      };
    };
    return new generator();
  })
  .directive('nghHinduLang', function (elementIdGen) {

    function link(scope, element, attrs) {

      var languages = ['sanskrit', 'telugu', 'hindi', 'tamil','english'];
      var defaultLanguage = 'english';
      var language = defaultLanguage;
      var elementName = elementIdGen.generate();
      var enabled = false;

      //console.log(attrs.nghHinduLang);

      scope.$watch(attrs.nghHinduLang, function (value) {
        if (_.isUndefined(value))
          language = attrs.nghHinduLang;
        else
          language = value;
        if (_.contains(languages, language)) {
          console.log('language changed:' + language);
          pramukhIME.enable(elementName, element[0]); //enables only on element
          //pramukhIME.setLanguage(language, 'pramukhindic'); // set language
        } else {
          language = defaultLanguage;
          console.log('language defaulted to:' + language);
          //pramukhIME.setLanguage(defaultLanguage, 'pramukhindic'); // set language
          pramukhIME.disable(elementName); //disables only on element
        }
      });

      element.on('focus', function (event) {
        event.preventDefault();
        pramukhIME.setLanguage(language, 'pramukhindic'); // set language
      });
    }

    return {
      link: link
    }
  });