import { Media } from '@/components/Media'

import { Ingredient } from "@/payload-types";

export const IngredientsList = ({ ingredients }: { ingredients: (number | Ingredient)[] }) => {
    return <div className="flex flex-col">
    <h3>Ingredientenlijst:</h3>
    <ul>{ingredients.map((ingredient, index) => {
        return typeof ingredient === 'object' && ingredient !== null && <li className="flex flex-row h-10 align-center items-center gap-2" key={index}>
            <span className="w-10">{ingredient.image && typeof ingredient.image !== 'string' && <Media resource={ingredient?.image} size="14px" />}</span>            
            <span className="flex-1"><a href={`/ingredients/${ingredient.slug}`}>{ingredient.title}</a></span>
            
        </li>})}</ul></div>;
};