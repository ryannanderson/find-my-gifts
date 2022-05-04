var url = "https://find-my-gifts.herokuapp.com/gifts";
var urlUser = "https://find-my-gifts.herokuapp.com/users";
var urlSessions = "https://find-my-gifts.herokuapp.com/sessions";
// var url = "http://localhost:8080/gifts";
// var urlUser = "http://localhost:8080/users";
// var urlSessions = "http://localhost:8080/sessions";

var app = new Vue({
  el: "#app",
  data: {
    gifts: [],
    inputPerson: "",
    inputIdea: "",
    inputPrice: "",
    purchased: false,
    inputEvent: "",
    search: "",
    giftName: "",
    gift: {},
    _id: "",
    editButton: false,
    newGiftButton: false,
    addButton: true,
    addNew: false,
    signup: false,
    login: true,
    loggedIn: false,
    errors: {},
    complete: false,
    sFirstNameInput: "",
    sEmailInput: "",
    sPassInput: "",
    lEmailInput: "",
    lPassInput: "",
    user: [],
    userError: false,
    uniqueEmail: false,
    // socket: null
    // nameFilter: "", THIS IS FOR THE OTHER SEARCH FILTERING
  },
  methods: {
    // connectSocket: function () {
    //   this.socket = new WebSocket('ws://localhost:8080');
    //   this.socket.onmessage = (event) => {

    //   }
    // },
    validateGift: function () {
      this.errors = {};
      if (this.inputPerson.length == 0) {
        this.errors.name = "please specify a name";
      }
      if (this.inputIdea.length == 0) {
        this.errors.idea = "please specify an idea";
      }
      if (this.inputPrice.length == 0) {
        this.errors.price = "please specify a price";
      } else {
        return this.newGiftIsValid;
      }
    },
    validateUser: function () {
      this.errors = {};
      if (this.sFirstNameInput.length == 0) {
        this.errors.firstName = "please enter your first name";
      }
      if (this.sEmailInput == 0) {
        this.errors.email = "please enter an email";
      }
      if (this.sPassInput == 0) {
        this.errors.password = "please enter a password";
      } else {
        return this.newUserIsValid;
      }
    },
    fetchSessionsFromServer: function () {
      return fetch(/* "http://localhost:8080/gifts" */ urlSessions, {
        credentials: "include",
      }).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            // console.log("this worked", data);
            this.user = data;
            this.loggedIn = true;
            this.signup = false;
            this.login = false;
            this.newGiftButton = true;
            this.fetchGiftsFromServer();
          });
        }
      });
    },
    loginUser: function () {
      data = "email=" + encodeURIComponent(this.lEmailInput);
      data += "&plainPassword=" + encodeURIComponent(this.lPassInput);

      fetch(/* "http://localhost:8080/sessions"  */ urlSessions, {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((response) => {
        if (response.status == 201) {
          console.log("kind of working?");
          this.fetchSessionsFromServer().then((user) => {
            console.log("user logged in");
            this.user = user;
            this.lEmailInput = "";
            this.lPassInput = "";
            this.newGiftButton = true;
            this.loggedIn = true;
            this.login = false;
            this.signup = false;
            this.fetchGiftsFromServer();
          });
        } else {
          console.error("Save failed");
          this.userError = true;
        }
      });
    },
    signUpUser: function () {
      this.login = false;
      this.signup = true;
    },
    officialSignUp: function () {
      if (!this.validateUser()) {
        console.log("this works???");
        return;
      }
      var data = "firstName=" + encodeURIComponent(this.sFirstNameInput);
      data += "&email=" + encodeURIComponent(this.sEmailInput);
      data += "&password=" + encodeURIComponent(this.sPassInput);

      return fetch(/* "http://localhost:8080/users" */ urlUser, {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((response) => {
        if (response.status == 201) {
          this.lEmailInput = this.sEmailInput;
          this.lPassInput = this.sPassInput;
          this.sEmailInput = "";
          this.sFirstNameInput = "";
          this.sPassInput = "";
          this.loginUser();
          this.loggedIn = true;
          this.login = false;
          this.signup = false;
        } else {
          console.error("Save failed");
          this.uniqueEmail = true;
        }
      });
    },

    signUpToLogin: function () {
      this.signup = false;
      this.login = true;
    },

    logoutUser: function () {
      fetch(/* `http://localhost:8080/gifts/${giftId}` */ urlSessions, {
        method: "DELETE",
        credentials: "include",
      }).then((response) => {
        console.log("delete is working");
        if (response.status == 204) {
          this.fetchSessionsFromServer();
          this.loggedIn = false;
          this.login = true;
          this.newGiftButton = false;
          this.userError = false;
        } else {
          console.error("something bad happened when deleting gift");
        }
      });
    },

    newGift: function () {
      this.addNew = true;
    },

    addGift: function () {
      console.log("does the click work?");

      if (!this.validateGift()) {
        console.log("this works???");
        return;
      }
      var data = "name=" + encodeURIComponent(this.inputPerson);
      data += "&idea=" + encodeURIComponent(this.inputIdea);
      data += "&price=" + encodeURIComponent(this.inputPrice);
      //data += "&purchased=" + encodeURIComponent(this.purchased);
      data += "&event=" + encodeURIComponent(this.inputEvent);

      fetch(url, {
        method: "POST",
        credentials: "include",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((response) => {
        if (response.status == 201) {
          this.fetchGiftsFromServer();
        } else {
          console.error("Save failed");
        }
      });
      this.inputPerson = "";
      this.inputIdea = "";
      this.inputPrice = 0;
      this.addNew = false;
    },

    deleteGift: function (giftId) {
      console.log("does the click work?");
      fetch(/* `http://localhost:8080/gifts/${giftId}` */ url + "/" + giftId, {
        method: "DELETE",
        credentials: "include",
      }).then((response) => {
        console.log("delete is working");
        if (response.status == 204) {
          this.fetchGiftsFromServer();
        } else {
          console.error("something bad happened when deleting gift");
        }
      });
    },

    editGift: function (gift) {
      console.log("does this work?");
      this.gift = gift;
      this.inputPerson = this.gift.name;
      this.inputIdea = this.gift.idea;
      this.inputPrice = this.gift.price;
      this.purchased = this.gift.purchased;
      this.inputEvent = this.gift.event;
      this._id = this.gift._id;
      console.log("put is working", this.gifts.name);
      this.editButton = true;
      this.addButton = false;
      this.addNew = true;
    },

    saveGift: function () {
      var data = "name=" + encodeURIComponent(this.inputPerson);
      data += "&idea=" + encodeURIComponent(this.inputIdea);
      data += "&price=" + encodeURIComponent(this.inputPrice);
      data += "&purchased=" + encodeURIComponent(this.purchased);
      data += "&event=" + encodeURIComponent(this.inputEvent);
      fetch(
        /* `http://localhost:8080/gifts/${this._id}` */ url + "/" + this._id,
        {
          method: "PUT",
          credentials: "include",
          body: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ).then((response) => {
        this.fetchGiftsFromServer();
      });
      this.inputPerson = "";
      this.inputIdea = "";
      this.inputPrice = "";
      this.inputEvent = "";
      this.editButton = false;
      this.addButton = true;
      this.addNew = false;
    },

    giftPurchased: function (gift) {
      console.log(gift._id);
      var data = "name=" + encodeURIComponent(gift.name);
      data += "&idea=" + encodeURIComponent(gift.idea);
      data += "&price=" + encodeURIComponent(gift.price);
      data += "&purchased=" + encodeURIComponent(gift.purchased);
      data += "&event=" + encodeURIComponent(gift.event);
      fetch(
        /* `http://localhost:8080/gifts/${gift._id}` */ url + "/" + gift._id,
        {
          method: "PATCH",
          credentials: "include",
          body: data,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ).then((response) => {
        this.purchased = gift.purchased;
        this.fetchGiftsFromServer();
        console.log(gift.purchased);
      });
    },

    fetchGiftsFromServer: function () {
      fetch(/* "http://localhost:8080/gifts" */ url, {
        credentials: "include",
      }).then((response) => {
        if (response.status == 200) {
          response.json().then((data) => {
            console.log("this worked", data);
            this.gifts = data;
          });
        }
      });
    },
  },
  computed: {
    filteredSearches: function () {
      var gifts_array = this.gifts;
      var search = this.search;
      search = search.trim().toLowerCase();

      gifts_array = gifts_array.filter(function (item) {
        if (item.name.toLowerCase().indexOf(search) != -1) {
          return item;
        }
      });
      return gifts_array;
    },
    personIsInvalid: function () {
      return !!this.errors.name;
    },
    ideaIsInvalid: function () {
      return !!this.errors.idea;
    },
    priceIsInvalid: function () {
      return !!this.errors.price;
    },
    newGiftIsValid: function () {
      console.log("newGiftIsValid just got computed");
      return Object.keys(this.errors).length == 0;
    },

    firstNameIsInvalid: function () {
      return !!this.errors.firstName;
    },
    emailIsInvalid: function () {
      return !!this.errors.email;
    },
    passwordIsInvalid: function () {
      return !!this.errors.password;
    },
    newUserIsValid: function () {
      console.log("new user created");
      return Object.keys(this.errors).length == 0;
    },
  },
  created: function () {
    console.log("App is loaded and ready.");

    this.fetchSessionsFromServer();
  },
});
