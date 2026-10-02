import { CATEGORIES } from '../data/categories'
import type { Category, CategoryId } from '../types'

interface CategoryCardProps {
  category: Category
  active: boolean
  disabled: boolean
  onSelect: (id: CategoryId) => void
}

function CategoryCard({ category, active, disabled, onSelect }: CategoryCardProps) {
  return (
    <button
      type="button"
      className={`category-card${active ? ' category-card--active' : ''}`}
      aria-pressed={active}
      disabled={disabled}
      onClick={() => onSelect(category.id)}
    >
      <span className="category-card__emoji" aria-hidden="true">
        {category.emoji}
      </span>
      <span className="category-card__label">{category.label}</span>
      <span className="category-card__blurb">{category.blurb}</span>
    </button>
  )
}

interface CategoryPickerProps {
  activeCategory: CategoryId
  disabled?: boolean
  onSelect: (id: CategoryId) => void
}

function CategoryPicker({
  activeCategory,
  disabled = false,
  onSelect,
}: CategoryPickerProps) {
  return (
    <div className="category-grid" role="group" aria-label="Meme categories">
      {CATEGORIES.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          active={category.id === activeCategory}
          disabled={disabled}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default CategoryPicker