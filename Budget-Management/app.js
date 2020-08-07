const BudgetController = (() => {
  const Item = function (id, description, value, addedDate) {
    this.id = id;
    this.description = description;
    this.value = value;
    if (addedDate) this.addedDate = addedDate;
    else this.addedDate = getDate();
  };

  const Expense = function (id, description, value, addedDate) {
    Item.call(this, id, description, value, addedDate);
  };

  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = ((this.value * 100) / totalIncome).toFixed(1);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  const Income = function (id, description, value, addedDate) {
    Item.call(this, id, description, value, addedDate);
  };

  const calculateTotal = function (type) {
    const sum = data.allItems[type].reduce(
      (total, item) => total + item.value,
      0
    );
    data.totals[type] = sum;
  };

  const getDate = function () {
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
  };

  let data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    loadData: () => {
      const inc = JSON.parse(localStorage.getItem('inc'));
      const exp = JSON.parse(localStorage.getItem('exp'));

      const incomes = inc.map(
        (el) => new Income(el.id, el.description, el.value, el.addedDate)
      );

      const expenses = exp.map(
        (el) => new Expense(el.id, el.description, el.value, el.addedDate)
      );

      //console.log(incomes[0]);
      //console.log(expenses[0]);

      if (incomes) {
        //incomes.forEach((el) => (el = Object.assign(Income.prototype, el)));

        data.allItems['inc'] = incomes;
        //console.log(typeof incomes[0]);
      }

      if (expenses) {
        //expenses.forEach((el) => Object.assign(Expense.prototype, el));

        data.allItems['exp'] = expenses;
      }
    },

    addItem: (type, des, val) => {
      let newItem, ID;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      data.allItems[type].push(newItem);

      localStorage.setItem(type, JSON.stringify(data.allItems[type]));

      return newItem;
    },

    deleteItem: (id, type) => {
      let ids, index;

      ids = data.allItems[type].map((curr) => {
        return curr.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

      localStorage.setItem(type, JSON.stringify(data.allItems[type]));
    },

    // calculate total budget
    calculateBudget: () => {
      calculateTotal('exp');
      calculateTotal('inc');

      // total budget for all items
      data.budget = data.totals.inc - data.totals.exp;

      // calculate the percentage of expense
      if (data.totals.inc > 0) {
        data.percentage = ((data.totals.exp * 100) / data.totals.inc).toFixed(
          1
        );
      } else {
        data.percentage = -1;
      }

      // expese: 30 and income: 100, percentage of total expense = (30 * 100) / 100 = 33.3 (toFixed = 1)
    },

    // calculate percentage of each item
    calculatePercentages: () => {
      /*
        a=20
        b=10
        c=40
        income = 100
        a=20/100=20%
        b=10/100=10%
        c=40/100=40%
        */

      //console.log(data.allItems.exp);

      data.allItems.exp.forEach((item) => {
        item.calculatePercentage(data.totals.inc);
      });
    },

    getPercentages: () => {
      let allPercentages = data.allItems.exp.map((item) => {
        return item.getPercentage();
      });

      return allPercentages;
    },

    getBudget: () => {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    getIncomes: () => data.allItems['inc'],

    getExpenses: () => data.allItems['exp'],
  };
})();

const UIController = (() => {
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    deleteBtn: '.item__delete--btn',
    updateBtn: '.item__edit--btn',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
  };

  const formatNumber = (num, type) => {
    let numSplit, int, dec;

    /*
    + or - before number
    exactly 2 decimal points
    comma separating the thousands

    2310.4567 -> + 2,310.46
    2000 -> + 2,000.00
    */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  const nodeListForEach = (list, callback) => {
    for (let i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: () => {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: Number(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: (obj, type) => {
      let html, newHtml, element;

      // create html string with placeholder
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html =
          '<div class="item clearfix" id="inc-%id%"> <div class="item__date">%addedDate% | </div> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div><div class="item__edit"><button class="item__edit--btn" > <i class="fas fa-edit"></i></button ></div ></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"> <div class="item__date">%addedDate% | </div> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div><div class="item__edit"><button class="item__edit--btn" > <i class="fas fa-edit"></i></button ></div ></div></div>';
      }

      //console.log(obj.id);
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%addedDate%', obj.addedDate.substr(5));
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    updateListItem: (selectorId) => {
      let el = document.getElementById(selectorId);
      console.log(el.description);
      console.log(el);
    },

    deleteListItem: (selectorId) => {
      let el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    clearFields: () => {
      let fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: (obj) => {
      let type;
      obj.budget > 0 ? (type = 'inc') : (type = 'exp');

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        'inc'
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: (percentages) => {
      let fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, (current, index) => {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: () => {
      let now, months, month, year;

      now = new Date();
      //let christmas = new Date(2016, 11, 25);

      months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + ' ' + year;
    },

    changedType: () => {
      let fields = document.querySelectorAll(
        DOMstrings.inputType +
          ',' +
          DOMstrings.inputDescription +
          ',' +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function (cur) {
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
    },

    getDOMstrings: () => {
      return DOMstrings;
    },
  };
})();

const Controller = ((UICtrl, budgetCtrl) => {
  const setupEventListeners = () => {
    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (even) => {
      if (event.keyCode === 13 || even.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.deleteBtn)
      .addEventListener('click', ctrlDeleteItem);
    document
      .querySelector(DOM.inputType)
      .addEventListener('change', UICtrl.changedType);
    document
      .querySelector(DOM.updateBtn)
      .addEventListener('click', ctrlEditItem);
  };

  const updateBudget = () => {
    // Calculate the budget

    budgetCtrl.calculateBudget();

    // return budget
    let budget = budgetCtrl.getBudget();

    // display budget
    UICtrl.displayBudget(budget);
  };

  const updatePercentages = () => {
    // calculate percentages
    budgetCtrl.calculatePercentages();

    // get percentages from budget controller
    const percentages = budgetCtrl.getPercentages();

    // update UI with new percentages

    UICtrl.displayPercentages(percentages);
  };

  const ctrlAddItem = () => {
    let input, newItem;
    // get input
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // clear the fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlEditItem = (event) => {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // console.log(itemID);
    console.log('should update');
    if (itemID) {
      //inc-1
      splitID = itemID.split('-');

      type = splitID[0];
      ID = parseInt(splitID[1]);

      //console.log(`type: ${type}, id: ${ID}`);

      // delete the item from the data structure
      //budgetCtrl.deleteItem(ID, type);

      // delete the item from the UI
      UICtrl.updateListItem(itemID);

      // update and show the new budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  const ctrlDeleteItem = (event) => {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // console.log(itemID);

    if (itemID) {
      //inc-1
      splitID = itemID.split('-');

      type = splitID[0];
      ID = parseInt(splitID[1]);

      //console.log(`type: ${type}, id: ${ID}`);

      // delete the item from the data structure
      budgetCtrl.deleteItem(ID, type);

      // delete the item from the UI
      UICtrl.deleteListItem(itemID);

      // update and show the new budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: () => {
      console.log('Application started...');

      // load data from localstorage to budget controller
      budgetCtrl.loadData();
      budgetCtrl.calculateBudget();

      // retriver them from budget controller
      const incomes = budgetCtrl.getIncomes();
      const expenses = budgetCtrl.getExpenses();

      // console.log(incomes);

      // add to the UI if there any items
      if (incomes) incomes.forEach((el) => UICtrl.addListItem(el, 'inc'));
      if (expenses) expenses.forEach((el) => UICtrl.addListItem(el, 'exp'));

      const budget = budgetCtrl.getBudget();

      UICtrl.displayMonth();
      UICtrl.displayBudget(budget);
      updatePercentages();
      setupEventListeners();
    },
  };
})(UIController, BudgetController);

Controller.init();
