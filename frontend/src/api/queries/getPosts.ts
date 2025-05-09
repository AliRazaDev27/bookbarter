import axios from "axios";
export async function getPosts(title?: string, author?: string, minPrice?: string, maxPrice?: string, currency?: string, bookCondition?: string, exchangeType?: string, sortBy?: string, languages?: string, categories?: string, page?: number, limit?: number) {
    try{
        const params = new URLSearchParams();
        if (title) params.set("title", title);
        if (author) params.set("author", author);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (currency) params.set("currency", currency);
        if (bookCondition) params.set("bookCondition", bookCondition);
        if (exchangeType) params.set("exchangeType", exchangeType);
        if (sortBy) params.set("sortBy", sortBy);
        if (languages) params.set("languages", languages);
        if (categories) params.set("categories", categories);
        if (page) params.set("page", page.toString());
        if (limit) params.set("limit", limit.toString());
      const result = await axios.get(`http://localhost:3000/posts?${params.toString()}`);
      const posts = await result.data;
      return posts;
    }
    catch(error:any){
        console.log(error.message);
        return error.message;
    }
}
