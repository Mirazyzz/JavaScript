const BudgetController = (() => {
  const Item = function (id, description, value, addedDate) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.addedDate = addedDate;
  };

  const Expense = function(id, description, value, addedDate){
    Item.call(id, description, value, addedDate);
  }

  Expense.prototype.calculatePercentage = function(totalIncome){
    if(totalIncome > 0){
        this.percentage = (this.value * 100) / totalIncome;
    }else{
        this.percentage = -1;
    }
  }

  const Income = function(id, description, value, addedDate){
      Item.call(this, id, description, value, addedDate)
  }

  data = {
      items = {
          incomes: [],
          expenses: []
      },
      totals = {
        inc: 0,
        exp: 0
      },
      budget: 0,
      percentage: -1
  };
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
