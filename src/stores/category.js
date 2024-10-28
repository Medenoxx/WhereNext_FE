import {defineStore} from "pinia";
import axios from "axios";
import {API_URL} from "@/_helper/api.js";

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [],
    }),
    getters: {
        getCategoryByName: (state) => (name) => {
            return state.categories.find((category) => category.name === name);
        }
    },
    actions: {
        async createCategory(categoryData) {
            try {
                const response = await axios.post(`${API_URL}/category`, categoryData);
                return response.data;
            } catch (error) {
                console.error('Failed to create category', error);
                throw error;
            }
        },
        async fetchAllCategories() {
            try {
                const response = await axios.get(`${API_URL}/categories`);
                console.log('API response:', response.data);
                this.categories = response.data;
                console.log('Categories in store:', this.categories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                throw error;
            }
        }
    }
})

//todo deleteCategoryById und editCategoryById
