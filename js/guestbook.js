/**********************************************
* Helpers for localstorage of objects
**********************************************/
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    return this.getItem(key) && JSON.parse(this.getItem(key));
}

/**********************************************
* Application init
**********************************************/
var Guestbook = {
  init: function(){
    Guestbook.Main();
  }
};

$(document).ready( function() { Guestbook.init(); });


/**********************************************
* Application
**********************************************/
Guestbook.Main = function(){
  var self = Guestbook.Main;

  self.General.initialize();
};

var Guestbook_Entry = function(){
  return {date: null,
  fullname: null,
  email: null,
  content: null};
};

Guestbook.Main.General = function(){
  var add_content, attach_events, format_message, load_content, toggle,
      holders={add: null, field_fullname: null, field_email: null, field_message: null, grid: null, list: null, root: null},
      pub={};

  pub.initialize = function(){
    holders.root = $('#wrapper-global');
    holders.add = holders.root.find('#add');
    holders.list = holders.root.find('#list');
    holders.field_fullname = holders.add.find('#field-fullname');
    holders.field_email = holders.add.find('#field-email');
    holders.field_message = holders.add.find('#field-message');
    holders.grid = holders.list.find('table');

    attach_events();

    load_content();
  };

  attach_events = function(){
    $('#link-list').click(function(){ 
      toggle($(this), 'list'); return false; 
    });

    $('#link-add').click(function(){ 
      holders.field_fullname.focus();
      toggle($(this), 'add'); return false; 
    });

    $('#link-reset').click(function(){ 
      localStorage.setObject('guestbook_entries', []);
      holders.grid.find('tr.row').remove();
      return false; 
    });

    holders.add.find('form').submit(function(){
      var entry, entries = Guestbook.Main.General.get_entries();

      if(holders.field_fullname.val() !== '' && holders.field_email.val() !== '' && holders.field_message.val() !== ''){

        entry = new Guestbook_Entry();
        entry.date = new Date();
        entry.fullname = holders.field_fullname.val();
        entry.email = holders.field_email.val();
        entry.content = holders.field_message.val();

        entries.push(entry);
        localStorage.setObject('guestbook_entries', entries);

        holders.add.find('form input').each(function(){ if($(this).attr('type') !== 'submit'){ $(this).val(''); } });
        holders.add.find('form textarea').each(function(){ $(this).text(''); });

        $('#link-list').click();
        add_content(entry, true);
      }

      return false;
    });


  };

  pub.get_entries = function(){
    var entries;

    try{
      entries = localStorage.getObject('guestbook_entries');
    }
    catch(e){

    }

    if(!entries){ entries = []; }
    return entries;
  };

  add_content = function(entry, highlight){
    var uid= new Date().getTime(), row;

    row = '<tr class="row" id="' + uid + '"><td>' + entry.date + '</td><td>' + entry.fullname + '</td><td>' + entry.email + '</td><td>' + format_message(entry.content) + '</td></tr>';

    holders.list.find('table tbody tr:last').after(row);
  
    //if(highlight){ holders.grid.find('#' + uid + ' td').effect('highlight', {color: 'green'}, 2000); }
  };

  format_message = function(message){
    var icon = '<img src="http://ykwis.com/emos/simley2.gif" />';
    return message.replace(/:D|:-D|:\)|:-\)|;\)|';-\)|:\(|:-\(|:o|:\?|8-\)|:x|:P/gi, icon);
  };

  load_content = function(){
    var entries = Guestbook.Main.General.get_entries();

    $.each(entries, function(i, entry){
      add_content(entry);
    });
  };


  toggle = function(link, item){
    holders.root.find('nav a').removeClass('selected');

    if(item === 'list'){
      holders.add.hide();
      holders.list.show();
    }
    else if(item === 'add'){
      holders.list.hide();
      holders.add.show();
    };

    link.addClass('selected');
  };

  return pub;
};
Guestbook.Main.General = Guestbook.Main.General();
