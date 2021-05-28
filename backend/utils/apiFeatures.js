
    class APIFeatures {
        
        constructor(query, queryStr){
            this.query = query;
            this.queryStr = queryStr;
        }
        // search method
         // i mean its case insensitive 
        search() {
            const keyword = this.queryStr.keyword ? {
                    name: {
                        $regex: this.queryStr.keyword,
                        $options: 'i'
                    }
            } : {}

            console.log(keyword);
            this.query = this.query.find({...keyword});
            return this;
        }
        filter(){
            
            const queryCopy = {...this.queryStr};
            console.log(queryCopy);

            // removing fields from the query
            // remove the following fields in order to filter the prodcuts with category
            const removeFields = ['keyword','limit', 'page']
            removeFields.forEach(el => delete queryCopy[el])

            //advance filtering with price range, rating 
            let queryStr = JSON.stringify(queryCopy);
            queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

            console.log(queryStr);
            this.query = this.query.find(JSON.parse(queryStr));
            return this;
        }

        pagination(resPerPage){
            const currentPage = Number(this.queryStr.page) || 1;

            // skipping results
            const skip = resPerPage * (currentPage -1);

            this.query = this.query.limit(resPerPage).skip(skip);
            return this;
        }
    }

    module.exports = APIFeatures;