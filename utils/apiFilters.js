class ApiFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    filter() {
        const queryCopy = {...this.queryStr};

        const removeFields = ['sort', 'fields', 'q', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);

        // Advance filter using: lt, lte, gt, gte
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
}

module.exports = ApiFilters;