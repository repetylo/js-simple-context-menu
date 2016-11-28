//   getting menu items from json

  function getMenuItems(){
    var scrollHeight = 0;

    var xmlhttp = new XMLHttpRequest();
    var url = "menu-items.json";
    
    xmlhttp.onreadystatechange = function() {
      
      var menu, menuHTML, menuItem;
      
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var menus = JSON.parse(xmlhttp.responseText);
        for (i = 0; i < menus.length; i++) {
          
          menu = new Object ();
          menu.id = menus[i].id;
          menu.position = menus[i].position;
          
          var unsortedMenuItems = menus[i].items;
          
          var subMenu ="";
          
          function wrightMenuHTML(a) {
            menuHTML = '<ul class="menu">' + a + '</ul>'
          };
          
          function wrightSubmenuHTML(a, b) {
            subMenu = '<ul class="submenu ' + a + '">' + b + '</ul>'
          };
          
          function itemHTML(a) {
            menuItem = '<li class="menu-item ' + a.status + " " + a.type +'-parent"><span>' + a.title + '</span>' + subMenu + '</li>'
          };
          
          var menuItems = "";
          
          for (i = 0; i < unsortedMenuItems.length; i++) {

            if (unsortedMenuItems[i].parent == null) {
              
              if (unsortedMenuItems[i].type == "submenu") {
                
                var submenuItems = "";
                var findSubmenuItems = unsortedMenuItems.filter(function( obj ) {
                  return obj.parent == unsortedMenuItems[i].id;
                });
                
                for (j = 0; j < findSubmenuItems.length; j++) {
                    
                    if (findSubmenuItems[j].type == "submenu") {
                      
                      var subSubmenuItems = "";
                      
                      var findSubSubmenuItems = unsortedMenuItems.filter(function( obj ) {
                        return obj.parent == findSubmenuItems[j].id;
                      });
                      
                      for (k = 0; k < findSubSubmenuItems.length; k++) {
                        itemHTML(findSubSubmenuItems[k]);
                        subSubmenuItems += menuItem;
                        subMenu = "";
                      };
                      wrightSubmenuHTML(findSubmenuItems[j].id, subSubmenuItems);
                    };
                  itemHTML(findSubmenuItems[j]);
                  submenuItems += menuItem;
                  subMenu = "";
                };
                wrightSubmenuHTML(unsortedMenuItems[i].id, submenuItems);
              };
              itemHTML(unsortedMenuItems[i]);
              menuItems += menuItem;
              subMenu="";
            };  
          };
          wrightMenuHTML(menuItems);
          
          //add menu items to menu object
          menu.items = menuHTML; 
          
          //add menu into chosen position
          function addMenu (){
            document.getElementById(menu.position).innerHTML = menuHTML;
          } addMenu();
          
          
          //mouse navigation
          var allEnabled = document.getElementsByClassName("enabled");
          
          for (i=0; i<allEnabled.length; i++) {
            allEnabled[i].addEventListener("mouseover", mouseOver);
            allEnabled[i].addEventListener("mouseout", mouseOut);
          };
          
          function mouseOver() {
            this.classList.add("active");
            
            if (this.getElementsByTagName("ul").length>0) {
              var subMenuUl = this.getElementsByTagName("ul");
              var rect = subMenuUl[0].getBoundingClientRect();

              if (rect.bottom>window.innerHeight) { moveVertikal() };
              function moveVertikal (){
                var newTop=window.innerHeight-rect.height;
                console.log(this)
                subMenuUl[0].style.position="fixed";
                subMenuUl[0].style.top=newTop+"px";
                subMenuUl[0].style.left="164px";
              };
            };
          };
          
          function mouseOut() {
            this.classList.remove("active");
          };
          
          // keyboard arrows navigation
          window.addEventListener('keydown', keyChange, false);
          
          function keyChange (event) {
            switch (event.which) {
              
              // down key
              case 40: {   
                
                if (document.getElementsByClassName("active").length>0) {
                  var allActive = document.getElementsByClassName("active");
                  allActive[allActive.length - 1].nextElementSibling.classList.add("active");
                  allActive[allActive.length - 2].classList.remove("active");

                      if (allActive[0].getBoundingClientRect().bottom>window.innerHeight) {
                      scrollHeight -= allActive[0].getBoundingClientRect().height;

                      document.body.style.top = scrollHeight+"px";
                    };
                } else {allEnabled[0].classList.add("active")};
                break;
              };
              
              // up key
              case 38: {
                
                if (document.getElementsByClassName("active").length>0) {
                  var allActive = document.getElementsByClassName("active");
                  allActive[allActive.length - 1].previousElementSibling.classList.add("active");
                  allActive[allActive.length - 1].classList.remove("active");

                  if (allActive[0].getBoundingClientRect().top<0) {
                    scrollHeight += allActive[0].getBoundingClientRect().height;
                    document.body.style.top = scrollHeight+"px";
                  };
                };
                break;
              };
              // right key
              case 39: { 
                
                if (document.getElementsByClassName("submenu-parent active").length>0) {
                  var allActive = document.getElementsByClassName("submenu-parent active ");
                  allActive[allActive.length - 1].lastElementChild.firstElementChild.classList.add("active");
                };
                break;
              };
              // left key
              case 37: { 
                
                if (document.getElementsByClassName("active").length>0) {
                  var allActive = document.getElementsByClassName("active ");
                  allActive[allActive.length - 2].classList.add("active");
                  allActive[allActive.length - 1].classList.remove("active");
                };
                break;
              };
            };
          };
        };
      }; 
    };
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send(); 
	} getMenuItems();