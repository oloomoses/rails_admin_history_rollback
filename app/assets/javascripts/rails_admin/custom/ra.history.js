
(function($) {
  $.widget("ra.history", {

    _create: function() {
      var widget = this;
      var dom_widget = widget.element;

      var changesetLink = dom_widget.find('.changeset');
      changesetLink.unbind().bind("click", function(e){
        widget._bindModalOpening(e, $(this).data('url'));
      });
    },

    _bindModalOpening: function(e, url) {
      e.preventDefault();
      
      widget = this;

      
      if($("#modal").length) {
        widget.dialog = false
        // return false
      }

      var dialog = this._getModal();
      setTimeout(function() { // fix race condition with modal insertion in the dom (Chrome => Team/add a new fan => #modal not found when it should have). Somehow .on('show') is too early, tried it too.
        $.ajax({
          url: url,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Accept", "text/javascript");
          },
          success: function(data, status, xhr) {
              dialog.find('.modal-body').html(data);
              widget._bindFormEvents();
          },
          error: function(xhr, status, error) {
            dialog.find('.modal-body').html(xhr.responseText);
          },
          dataType: 'text'
        });
      }, 200);

    },

    _bindFormEvents: function() {
      
      var widget = this,
          dialog = this._getModal(),
          table = dialog.find("table")
          saveButton = dialog.find('.save-action');
      dialog.find('.modal-header-title').html(table.data('title'));
      dialog.find('.cancel-action').unbind().click(function() {
        dialog.each(function(index, element) {
          bootstrap.Modal.getInstance(element).hide();          
        });
        
        return false;
      }).html(table.data('cancel'));
      dialog.find('#version tr').prettyTextDiff();
      saveButton.attr('href', table.data('rollbackurl')).data('confirm', table.data('confirm')).html(table.data('rollback'));
    },

    _getModal: function() {
      var widget = this;
      if (!widget.dialog) {
        widget.dialog = $(
          '<div id="modal" class="modal fade">\
            <div class="modal-dialog modal-lg">\
            <div class="modal-content">\
            <div class="modal-header">\
			        <h3 class="modal-header-title">...</h3>\
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>\
            </div>\
            <div class="modal-body">\
              ...\
            </div>\
            <div class="modal-footer">\
              <a href="#" class="btn cancel-action">...</a>\
              <a href="#" class="btn btn-primary save-action" data-method="put" data-confirm="Are you sure?">...</a>\
            </div>\
            </div>\
            </div>\
          </div>'
        ).on('hidden.bs.modal', function(){
          widget.dialog.remove();   // We don't want to reuse closed modals
          widget.dialog = null;
        });

        new bootstrap.Modal(widget.dialog[0], {
          keyboard: true,
          backdrop: true,
          focus: false,
          show: true,
        }).show();
      }
      return this.dialog;
    }
  });
})(jQuery);

(function ($){
  $(document).on('rails_admin.dom_ready', function() {
    $('#history').history();
  });

  
	
}(jQuery))
