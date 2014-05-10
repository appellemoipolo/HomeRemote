(function() {
  brite.registerView("Scene",{

    create: function(){
      return render("tmpl-Scene", {ScenesList:main.scenesLists});
    },

    postDisplay: function(){
      var view = this;


    },

    events:{

    }
  });
})();
