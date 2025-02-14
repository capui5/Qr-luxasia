sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/ui/core/routing/History",
], function (Controller, MessageToast, JSONModel, History, MessageBox) {
  "use strict";


  return Controller.extend("com.newcustqr.newcustqr.controller.CreateNewCust", {
    onInit: function () {

      var decryptedData = atob(window.location.search.split("?BA=")[1]);
      var UserEmail = decryptedData.split("##")[0];
      var CountryCode = decryptedData.split("##")[2];
      sap.ui.getCore().getConfiguration().setLanguage(CountryCode);
      var BAUserID = decryptedData.split("##")[2];
      var qrCodeGeneratedDateTime = new Date(decryptedData.split("##")[2]);
      var currentDateTime = new Date();
      var differenceValue = (currentDateTime.getTime() - qrCodeGeneratedDateTime.getTime()) / 1000;
      differenceValue /= 60;
      var result = Math.abs(differenceValue);
      if (result <= 5) {
        //load simpleform
      } else {

      }

      if (CountryCode) {

        var oCountrySelect = this.byId("country");
        var oCountryCodeSelect = this.byId("countrycode")
        oCountrySelect.setSelectedKey(CountryCode);
        oCountryCodeSelect.setSelectedKey(CountryCode)
      } else {
        console.warn("Selected country not found in StoreModel.");
      }
      this.CustomerInterest();
      var aModel = this.getOwnerComponent().getModel("CustomerNoModel")
      this.getView().setModel(aModel, "CustomerNoModel");
      var oDatePicker = this.byId("datePickerId");
      var oOwnerComponent = this.getOwnerComponent();
      if (oOwnerComponent) {
        // Your logic using the component reference goes here
      } else {
        console.error("Owner component not found.");
      }
      // Create a model for the date value and set the format options
      var oModel = new sap.ui.model.json.JSONModel({
        dateValue: new Date() // Initialize with current date or your desired initial date
      });
      oDatePicker.setModel(oModel);

      // Define the binding path for the DatePicker value property
      oDatePicker.bindProperty("value", {
        path: "/dateValue",
        type: new sap.ui.model.type.Date({
          pattern: "yyyy-MM-dd"
        })
      });
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

      var oModel = this.getOwnerComponent().getModel("BrandStoreModel");
      console.log(oModel);

      this.oRouter = this.getOwnerComponent().getRouter();
      var oOwnerComponent = this.getOwnerComponent();
      var oStoreModel = oOwnerComponent.getModel("StoreModel");

      if (oStoreModel) {
        var selectedStoreId = oStoreModel.getProperty("/selectedStoreId");

        if (selectedStoreId) {
          console.log("Selected Store ID found:", selectedStoreId);
        } else {
          console.log("Selected Store ID not found.");
        }
      } else {
        console.error("StoreModel not found.");
      }
      // Initialize the JSON model for CSRF token




      this.CountrySetData();
      this.CountryCodeData();
    },
    getRouter: function () {
      return UIComponent.getRouterFor(this);
    },
    Onroutetotranspage: function () {
      var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      var oCustomerNoModel = this.getView().getModel("CustomerNoModel");

      if (!oCustomerNoModel || !oCustomerNoModel.getProperty("/Firstnames") || oCustomerNoModel.getProperty("/Firstnames").length === 0) {
        // CustomerNo not found or empty array, display a message or take necessary action
        // For example, show a message and prevent navigation
        sap.m.MessageBox.error("Customer No not found. Please create a new customer and try again.", {
          onClose: function () {
            // Handle the action when the message box is closed
            // For example, stay on the current page or navigate elsewhere
          }
        });
      } else {
        // CustomerNo found in the model, proceed with navigation
        oRouter.navTo("transaction");
      }
    },

    CountrySetData: function () {
      var that = this;

      $.ajax({
        type: "GET",
        url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/CountrySet",
        headers: {

        },
        dataType: "json",
        success: function (data) {
          console.log(data.d.results);

          // Create a new JSON model
          var oModel = new sap.ui.model.json.JSONModel();

          // Set received data to the JSON model
          oModel.setData(data.d.results);

          // Set the JSON model to your view or component
          that.getView().setModel(oModel, "CountryModel");
          console.log(oModel);
        },
        error: function (error) {
          console.error("Error fetching country data:", error);
          // Handle error scenarios here
        }
      });
    },
    CountryCodeData: function () {
      var that = this;


      $.ajax({
        type: "GET",
        url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/CountryTelCodeSet",
        headers: {


        },
        dataType: "json",
        success: function (data) {
          console.log(data.d.results);

          // Create a new JSON model
          var oModel = new sap.ui.model.json.JSONModel();

          // Set received data to the JSON model
          oModel.setData(data.d.results);

          // Set the JSON model to your view or component
          that.getView().setModel(oModel, "CountryTelCodeModel");
          console.log(oModel);
        },
        error: function (error) {
          console.error("Error fetching country data:", error);
          // Handle error scenarios here
        }
      });
    },

    CustomerInterest: function () {
      var that = this;


      $.ajax({
        type: "GET",
        url: "./sap/opu/odata/sap/ZSDGW_CE_APP_SRV/ProductInterestSet",
        headers: {


        },
        dataType: "json",
        success: function (oData) {
          const dataByType = {
            ZHEAR: [],
            ZPRDINTER: [],
            ZPRDDEMO: []
          };

          // Organize data based on Type
          oData.d.results.forEach(item => {
            dataByType[item.Type].push(item);
          });

          // Add an extra empty item to each type
          Object.keys(dataByType).forEach(key => {
            if (key !== "ZPRDINTER") {
              dataByType[key].unshift({});
            }
          });

          // Create a JSONModel and set the organized data
          const interestModel = new sap.ui.model.json.JSONModel();
          interestModel.setData(dataByType);

          // Set the model to the view
          this.getView().setModel(interestModel, "ProductInterest");

          // Log the model
          console.log("Product Interest Model:", interestModel);
        }.bind(this),
        error: function (oError) {
          console.error("Error occurred while fetching data:", oError);
        }
      });
    },
    onCreateProfile: function () {
      this.onCreateProfileServiceCall();
    },
    onCreateProfileServiceCall: function () {
      var that = this;
      var decryptedData = atob(window.location.search.split("?BA=")[1]);
      var sStoreId = decryptedData.split("##")[0];
      var UserEmail = decryptedData.split("##")[1];
      var BAUserID = decryptedData.split("##")[3];
      console.log(BAUserID);

      var datePicker = this.getView().byId("datePickerId");
      var selectedDate = datePicker.getDateValue();
      var milliseconds = selectedDate.getTime();
      var formattedDat = '/Date(' + milliseconds + ')/';
      var postalCode = this.getView().byId("pcode").getValue();
      var datePicker = this.getView().byId("datePickerId");


      var selectedDate = datePicker.getDateValue();


      var currentDate = new Date();
      var age = currentDate.getFullYear() - selectedDate.getFullYear();


      if (age < 18) {
        sap.m.MessageBox.error(that.getOwnerComponent().getModel("i18n").getProperty("atleast_18years_create_profile"));
        return;
      }


      // var oData = oModel.getProperty("/"); 
      // if (oData && oData.results && oData.results.length > 0) {
      //     var EmployeeId = oModel.getProperty("/results/0/Pernr");
      //     // Use the value of 'yourProperty' as needed

      // } else {
      //     console.error("No data available in the model or at the specified index.");
      // }
      // var oStoreModel = this.getOwnerComponent().getModel("StoreModel");
      // var sStoreId = oStoreModel.getProperty("/selectedStoreId");
      var multiComboBox = this.getView().byId("pinterets");
      var selectedItems = multiComboBox.getSelectedItems();
      var selectedItemsText = selectedItems.map(function (item) {
        return item.getText();
      });
      var selectedItemsString = selectedItemsText.join(';');
      var SelectedHearUS = this.getView().byId("phear").getSelectedItem().getText();

      var SelectedProductDemo = this.getView().byId("pdemo").getSelectedItem().getText();
      var selectedCountryKey = this.getView().byId("country").getSelectedKey();
      var selectedCountryCodeText = this.getView().byId("countrycode").getSelectedItem().getText();
      var payload = {
        "Gender": "1",
        "SalesOrg": "",
        "TitleP": this.getView().byId("title").getSelectedKey() ? this.getView().byId("title").getSelectedItem().getText() : "",
        "Firstname": this.getView().byId("fname").getValue(),
        "Lastname": this.getView().byId("lname").getValue(),
        "Middlename": "",  // Assuming Middle Name is same as Last Name
        "Secondname": "Second name",
        "City": this.getView().byId("city").getValue(),
        "District": "",
        "PostlCod1": postalCode,
        "PostlCod2": "",
        "PoBox": "",
        "PoBoxCit": "",
        "Street": this.getView().byId("street1").getValue(),
        "HouseNo": "10",
        "Building": "12A",
        "Floor": "1",
        "RoomNo": "",
        "Country": selectedCountryKey,
        "Countryiso": "",
        "Region": "",
        "Tel1Numbr": this.getView().byId("phoneno").getValue(),
        "Tel1Ext": selectedCountryCodeText,
        "FaxNumber": "",
        "FaxExtens": "",
        "EMail": this.getView().byId("email").getValue(),
        "LanguP": "EN",
        "LangupIso": "",
        "Currency": "SGD",
        "CurrencyIso": "",
        "TitleKey": "",
        "OnlyChangeComaddress": true,
        "Katr1": "",
        "Katr2": "",
        "Katr3": "",
        "Katr4": "",
        "Katr5": "",
        "Katr6": "",
        "Katr7": "",
        "Katr8": "Y",
        "CustomerNo": "",
        "Dob": formattedDat,
        "SalesEmp": BAUserID,
        "StoreId": sStoreId,
        "CreatedByEmail": UserEmail,
        "Hearus": SelectedHearUS,
        "Prdinterest": selectedItemsString,
        "Productdemo": SelectedProductDemo,
      };


      // var csrfToken = this.getView().getModel("csrfModel").getProperty("/csrfToken");
      // console.log(csrfToken);
      var oBusyDialog = new sap.m.BusyDialog({
        title: that.getOwnerComponent().getModel("i18n").getProperty("Creating_New_Customer"),
        text: that.getOwnerComponent().getModel("i18n").getProperty("Please_Wait")
      });
      oBusyDialog.open();
      $.ajax({
        type: "POST",
        url: "./sap/opu/odata/sap/ZSDGW_CUST_CE_APP_SRV/CustomerSet",
        data: JSON.stringify(payload),
        contentType: "application/json",
        headers: {

        },
        // this.getOwnerComponent().getModel("mainModel").setHeaders({
        //   "X-REQUESTED-WITH": "XMLHTTPRequest"
        // });
        // this.getOwnerComponent().getModel("mainModel").create("/CustomerSet", payload, {

        success: function (data) {
          oBusyDialog.close();


          if (data && data.getElementsByTagName("content").length > 0) {
            var content = data.getElementsByTagName("content")[0];

            if (content.getElementsByTagName("m:properties").length > 0) {
              var mProperties = content.getElementsByTagName("m:properties")[0];

              if (mProperties.getElementsByTagName("d:CustomerNo").length > 0) {
                var customerNo = mProperties.getElementsByTagName("d:CustomerNo")[0].textContent;
                var oCustomerNoModel = that.getView().getModel("CustomerNoModel");

                // Check if the model exists; if not, create a new JSON model and set it to the view
                if (!oCustomerNoModel) {
                  oCustomerNoModel = new sap.ui.model.json.JSONModel();
                  that.getView().setModel(oCustomerNoModel, "CustomerNoModel");
                }

                // Get existing array or initialize it if it doesn't exist
                var aCustomerFirstnames = oCustomerNoModel.getProperty("/Firstnames") || [];

                // Add the retrieved customerNo directly to the Firstnames array
                if (customerNo) {
                  aCustomerFirstnames.push(customerNo); // Pushing CustomerNo into the array
                }

                // Set the modified array back to the model under /Firstnames property
                oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);


                // Set the modified array back to the model under /Firstnames property
                oCustomerNoModel.setProperty("/Firstnames", aCustomerFirstnames);
                // Show a MessageBox with customer number
                sap.m.MessageBox.success(that.getOwnerComponent().getModel("i18n").getProperty("Record_successfully_created_CustomerNo") + customerNo, {
                  onClose: function () {
                    if (oCustomerNoModel) {
                      oCustomerNoModel.setProperty(pathToSet, customerNumber); // Set the property at the specified path
                    } else {
                      console.error("CustomerNoModel not found.");
                    }
                  }

                });
              } else {
                // Show a generic success MessageBox if 'CustomerNo' is not present
                sap.m.MessageBox.success("Record successfully created", {
                  title: "Success",
                  actions: [sap.m.MessageBox.Action.OK],
                  onClose: function () {

                  }// Binding 'this' to the function to ensure the correct context
                });
              }
            } else {
              console.error("Error: 'm:properties' not found in the response.");
            }
          } else {
            console.error("Error: 'content' not found in the response.");
          }
        },




        error: function (error) {
          oBusyDialog.close();
          var errorMessage = that.getOwnerComponent().getModel("i18n").getProperty("Error creating record");
          if (error && error.responseXML) {
            var xmlDoc = error.responseXML;
            var errorMessageNode = xmlDoc.querySelector("message");
            if (errorMessageNode) {
              errorMessage = errorMessageNode.textContent;
            }
          }

          sap.m.MessageBox.error(errorMessage);
        }
      });
    }
  });
});