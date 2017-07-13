var CheckBox =
{
  View:
  {
    button: $.checkboxButton
  },
  Var:
  {
    buttonOptions:
    {
      backgroundUncheckedImage: WPATH('/images/checkbox/checkbox-icon-unchecked.png'),
      backgroundCheckedImage: WPATH('/images/checkbox/checkbox-icon-checked.png'),
      value: false
    },
  },
  Controller:
  {
    unchecked: function()
    {
      CheckBox.View.button.backgroundImage = CheckBox.Var.buttonOptions.backgroundUncheckedImage;
      CheckBox.Var.buttonOptions.value = false;
    },
    checked: function()
    {
      CheckBox.View.button.backgroundImage = CheckBox.Var.buttonOptions.backgroundCheckedImage;
      CheckBox.Var.buttonOptions.value = true;
    },

    onButtonClicked: function(e)
    {
      CheckBox.Var.buttonOptions.value?CheckBox.Controller.unchecked():CheckBox.Controller.checked();
    },

    change: function()
    {
      CheckBox.Var.buttonOptions.value?CheckBox.Controller.unchecked():CheckBox.Controller.checked();
    },

    initialize: function()
    {
      CheckBox.View.button.addEventListener("click", CheckBox.Controller.onButtonClicked);
      CheckBox.Controller.unchecked();
      $.on("CheckBox:checkbox:checked", CheckBox.Controller.onButtonClicked);
    }
  }
};
exports.init = CheckBox.Controller.initialize;
exports.value = CheckBox.Var.buttonOptions.value;
exports.unchecked = CheckBox.Controller.unchecked;
exports.checked = CheckBox.Controller.checked;
exports.change = CheckBox.Controller.change;
