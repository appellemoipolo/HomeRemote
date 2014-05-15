(function() {
  brite.registerView('Scene',{

    create: function(){
      return render('tmpl-Scene', {ScenesList:main.scenarios});
    },

    postDisplay: function(){
      var view = this;


    },

    events:{

    }
  });
})();
