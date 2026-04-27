import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Apple,
  BarChart3,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Flame,
  Home,
  MoreHorizontal,
  Plus,
  Salad,
  Settings,
  Sparkles,
  Target,
  Utensils,
} from "lucide-react";
import "./styles.css";

const user = {
  name: "Pavan",
  goal: "Lean muscle gain",
  calories: 2300,
  macros: {
    protein: { goal: 150, unit: "g", color: "#166f77" },
    carbs: { goal: 260, unit: "g", color: "#c27803" },
    fat: { goal: 70, unit: "g", color: "#8f4a78" },
    fiber: { goal: 32, unit: "g", color: "#4f7f37" },
  },
};

const starterMeals = [
  { id: 1, name: "Oats, banana and whey", calories: 520, protein: 38, carbs: 72, fat: 12, fiber: 9 },
  { id: 2, name: "Chicken rice bowl", calories: 680, protein: 52, carbs: 78, fat: 18, fiber: 7 },
  { id: 3, name: "Greek yogurt snack", calories: 220, protein: 24, carbs: 20, fat: 5, fiber: 2 },
];

const quickFoods = [
  { name: "Eggs and toast", calories: 410, protein: 24, carbs: 34, fat: 18, fiber: 5 },
  { name: "Salmon quinoa plate", calories: 610, protein: 43, carbs: 52, fat: 25, fiber: 8 },
  { name: "Protein smoothie", calories: 360, protein: 32, carbs: 44, fat: 7, fiber: 6 },
  { name: "Lentil salad", calories: 480, protein: 26, carbs: 58, fat: 14, fiber: 15 },
];

const weeklyNutrition = [
  { day: "Mon", calories: 2140, protein: 142 },
  { day: "Tue", calories: 2290, protein: 151 },
  { day: "Wed", calories: 2060, protein: 134 },
  { day: "Thu", calories: 2380, protein: 158 },
  { day: "Fri", calories: 2210, protein: 146 },
  { day: "Sat", calories: 2460, protein: 161 },
  { day: "Sun", calories: 1780, protein: 114 },
];

function App() {
  const [screen, setScreen] = useState("dashboard");
  const [meals, setMeals] = useState(starterMeals);
  const [plan, setPlan] = useState("Build muscle");

  const totals = useMemo(
    () =>
      meals.reduce(
        (sum, meal) => ({
          calories: sum.calories + meal.calories,
          protein: sum.protein + meal.protein,
          carbs: sum.carbs + meal.carbs,
          fat: sum.fat + meal.fat,
          fiber: sum.fiber + meal.fiber,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
      ),
    [meals],
  );

  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  function addMeal(food) {
    setMeals((current) => [{ ...food, id: Date.now() }, ...current]);
    setScreen("dashboard");
  }

  return (
    <main className="app-shell">
      <section className="phone-frame">
        <header className="topbar">
          <div>
            <p className="muted">Welcome back</p>
            <h1>{user.name}</h1>
          </div>
          <div className="date-chip">
            <CalendarDays size={18} />
            <span>{today}</span>
          </div>
        </header>

        <section className="content">
          {screen === "dashboard" && <Dashboard totals={totals} meals={meals} />}
          {screen === "log" && <FoodLog meals={meals} addMeal={addMeal} />}
          {screen === "strategy" && <Strategy plan={plan} setPlan={setPlan} />}
          {screen === "more" && <More />}
        </section>

        <nav className="bottom-nav" aria-label="Primary">
          <NavButton icon={<Home />} label="Dashboard" active={screen === "dashboard"} onClick={() => setScreen("dashboard")} />
          <NavButton icon={<Utensils />} label="Log foods" active={screen === "log"} onClick={() => setScreen("log")} />
          <NavButton icon={<Target />} label="Strategy" active={screen === "strategy"} onClick={() => setScreen("strategy")} />
          <NavButton icon={<MoreHorizontal />} label="More" active={screen === "more"} onClick={() => setScreen("more")} />
        </nav>
      </section>
    </main>
  );
}

function Dashboard({ totals, meals }) {
  const calorieLeft = Math.max(user.calories - totals.calories, 0);
  const caloriePercent = Math.min((totals.calories / user.calories) * 100, 100);

  return (
    <div className="screen-stack">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Daily target</p>
          <h2>{user.calories.toLocaleString()} calories</h2>
          <p>{totals.calories.toLocaleString()} eaten, {calorieLeft.toLocaleString()} left today</p>
        </div>
        <div className="calorie-ring" style={{ "--progress": `${caloriePercent}%` }}>
          <Flame size={28} />
          <strong>{Math.round(caloriePercent)}%</strong>
        </div>
      </section>

      <section className="macro-grid">
        {Object.entries(user.macros).map(([key, macro]) => {
          const consumed = totals[key];
          const left = Math.max(macro.goal - consumed, 0);
          const percent = Math.min((consumed / macro.goal) * 100, 100);
          return (
            <article className="macro-card" key={key}>
              <div className="macro-head">
                <span className="macro-dot" style={{ background: macro.color }} />
                <span>{capitalize(key)}</span>
              </div>
              <strong>{macro.goal}{macro.unit}</strong>
              <p>{consumed}{macro.unit} eaten</p>
              <div className="meter"><span style={{ width: `${percent}%`, background: macro.color }} /></div>
              <small>{left}{macro.unit} left</small>
            </article>
          );
        })}
      </section>

      <section className="section-block">
        <div className="section-title">
          <h3>Weekly nutrition</h3>
          <BarChart3 size={20} />
        </div>
        <div className="weekly-chart">
          {weeklyNutrition.map((day) => (
            <div className="bar-item" key={day.day}>
              <span className="bar-value">{day.calories}</span>
              <div className="bar-track">
                <span style={{ height: `${Math.max((day.calories / user.calories) * 88, 20)}%` }} />
              </div>
              <b>{day.day}</b>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block recent">
        <div className="section-title">
          <h3>Today's foods</h3>
          <Salad size={20} />
        </div>
        {meals.slice(0, 3).map((meal) => (
          <div className="food-row" key={meal.id}>
            <div>
              <strong>{meal.name}</strong>
              <p>{meal.protein}g protein · {meal.carbs}g carbs · {meal.fat}g fat</p>
            </div>
            <span>{meal.calories}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

function FoodLog({ meals, addMeal }) {
  return (
    <div className="screen-stack">
      <section className="section-block">
        <div className="section-title">
          <h2>Log foods</h2>
          <Plus size={21} />
        </div>
        <div className="quick-grid">
          {quickFoods.map((food) => (
            <button className="quick-food" key={food.name} onClick={() => addMeal(food)}>
              <Apple size={22} />
              <span>{food.name}</span>
              <small>{food.calories} cal · {food.protein}g protein</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <h3>Logged today</h3>
        {meals.map((meal) => (
          <div className="food-row" key={meal.id}>
            <div>
              <strong>{meal.name}</strong>
              <p>{meal.fiber}g fiber · {meal.calories} calories</p>
            </div>
            <ChevronRight size={18} />
          </div>
        ))}
      </section>
    </div>
  );
}

function Strategy({ plan, setPlan }) {
  const steps = {
    "Lose fat": ["Keep a 350 calorie deficit", "Protein at every meal", "Walk after lunch and dinner"],
    "Build muscle": ["Hit protein target daily", "Add carbs around training", "Increase calories if weight stalls"],
    "Maintain": ["Stay within 100 calories", "Keep fiber above 30g", "Review weekly trend"],
  };

  return (
    <div className="screen-stack">
      <section className="strategy-hero">
        <Sparkles size={26} />
        <h2>Strategy for your goal</h2>
        <p>{user.goal}</p>
      </section>

      <section className="section-block">
        <div className="segmented">
          {Object.keys(steps).map((option) => (
            <button key={option} className={plan === option ? "active" : ""} onClick={() => setPlan(option)}>
              {option}
            </button>
          ))}
        </div>
        <div className="plan-list">
          {steps[plan].map((step, index) => (
            <div className="plan-step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function More() {
  const options = ["Profile and body metrics", "Macro targets", "Meal preferences", "Notifications", "Connected devices"];

  return (
    <div className="screen-stack">
      <section className="section-block">
        <div className="section-title">
          <h2>More options</h2>
          <Settings size={21} />
        </div>
        {options.map((option) => (
          <button className="option-row" key={option}>
            <ClipboardList size={19} />
            <span>{option}</span>
            <ChevronRight size={18} />
          </button>
        ))}
      </section>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button className={active ? "nav-item active" : "nav-item"} onClick={onClick} aria-label={label} title={label}>
      {React.cloneElement(icon, { size: 22 })}
      <span>{label}</span>
    </button>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

createRoot(document.getElementById("root")).render(<App />);
