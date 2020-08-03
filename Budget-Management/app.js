const BudgetController = (() => {
  const Item = function (id, description, value, addedDate) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.addedDate = getDate();
  };

  const Expense = function(id, description, value){
    Item.call(id, description, value, addedDate);
  }

  Expense.prototype.calculatePercentage = function(totalIncome){
    if(totalIncome > 0){
        this.percentage = (this.value * 100) / totalIncome;
    }else{
        this.percentage = -1;
    }
  }

  Expense.prototype.getPercentage = function(){
      return this.percentage;
  }

  const Income = function(id, description, value){
      Item.call(this, id, description, value, addedDate)
  }

  const calculateTotal = function(type) {
      const sum = data.allItems[type].reduce((total, item) => total + item.value, 0);
      data.totals[type] = sum;
  }

  const getDate = function(){
      const now = new Date();

      months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'June',
          'July',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
      ];

      const dd = String(now.getDate()).padStart(2, '0');
      const mm = now.getMonth();

      const date = `${now.getFullYear()}-${months[mm]}-${dd}`;

      return date;
  }

  data = {
      allItems = {
          inc: [],
          exp: []
      },
      totals = {
        inc: 0,
        exp: 0
      },
      budget: 0,
      percentage: -1
  };

  return {
      addItem: (type, des, val) => {
          let newItem, ID;
          

          if(data.allItems[type].length > 0) {
              ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          }else{
              ID = 0;
          }

          if(type === 'exp'){
              newItem = new Expense(ID, des, val);
          }else if(type === 'inc'){
              newItem = new Income(ID, des, val);
          }

          data.allItems[type].push(newItem);

          return newItem;
      },

      deleteItem: (id, type) => {
          let ids, index;

          ids = data.allItems[type].map((curr) => {
            return curr.id;
          });

          index = ids.indexOf(id);

          if(index !== -1){
              data.allItems[type].splice(index, 1);
          }
      }
  }
})();

const UIController = (() => {
  const DOMstrings = {
    totalBudget: '.budget__value',
    income: '.budget__income--value',
    expense: '.budget__expenses--value',
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expense__list',
    dateLabel: '.budget__title--month',
    percentageLabel: '.budget__expenses--percentage',
    itemPercentage: '.item__percentage',
  };

  return {
    DOMstrings,
  };
})();

const Controller = ((UIctrl) => {})(UIController);
