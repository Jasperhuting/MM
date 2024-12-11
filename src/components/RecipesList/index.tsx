import { Media } from '@/components/Media'

import { Ingredient, Recipe } from "@/payload-types";

export const RecipesList = ({ recipes }: { recipes: (number | Recipe)[] }) => {
    return <div className="flex flex-col">
    <h3>Recepten:</h3>
    <ul>{recipes.map((recipe, index) => {
        return typeof recipe === 'object' && recipe !== null && <li className="flex flex-row h-10 align-center items-center gap-2" key={index}>
            <span className="w-10">{recipe.image && typeof recipe.image !== 'string' && <Media resource={recipe?.image} size="14px" />}</span>            
            <span className="flex-1"><a href={`/recipes/${recipe.slug}`}>{recipe.title}</a></span>
            
        </li>})}</ul></div>;
};