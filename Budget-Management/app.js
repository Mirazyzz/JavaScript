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
      },

      // calculate total budget
      calculateBudget: () => {
          calculateTotal('exp');
          calculateTotal('inc');

          // total budget for all items
          data.budget = data.totals.inc - data.totals.exp;

          // calculate the percentage of expense
          if(data.totals.inc > 0){
              data.percentage = ((data.totals.exp * 100) / data.totals.inc).toFixed(1);
          }else{
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

        data.allItems.exp.array.forEach(item => {
            item.calculatePercentage(data.totals.inc);
        });
      },

      getPercentages: () => {
        let allPercentages = data.allItems.exp.map(item => {
            return item.getPercentage();
        });

        return allPercentages;
      },

      getBudget: () => {
          return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage
          };
      }
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
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
  };

  const formatNumber = (num, type) => {
      let numSplit, int, dec, type;

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
      for(let i = 0; i < list.length; i++){
          callback(list[i], i);
      }
  };

  return {
    getInput: () => {
        return {
            type: document.querySelector(DOMstrings.inputType).value,
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
        };
    },

    addListItem: (obj, type) => {
        let html, newHtml, element

        // create html string with placeholder
        if(type === 'ince'){
            element = DOMstrings.incomeContainer;

            html =
                '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;

            html =
                '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: (selectorId) => {
        let el = document.getElementById(selectorId);
        el.parentNode.removeChild(el);
    },

    clearFileds: () => {
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

        nodeListForEach(fields, function (current, index) {
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
    }
    
 }  
    
})();

const Controller = ((UICtrl, BdgCtrl) => {
    const setupEventListeners = () => {
        const DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', (even) => {
            if(event.keyCode === 13 || even.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    }
})(UIController, BudgetController);