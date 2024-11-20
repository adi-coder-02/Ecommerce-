import React, { useState, useEffect, useCallback } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] },
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(false); // Error state
    const [limit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [filteredResults, setFilteredResults] = useState([]);

    const init = useCallback(() => {
        getCategories()
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setCategories(data);
                }
            })
            .catch(() => {
                setError("Failed to load categories");
            });
    }, []);

    const loadFilteredResults = useCallback(
        (filters) => {
            getFilteredProducts(skip, limit, filters)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setFilteredResults(data.data);
                        setSize(data.size);
                        setSkip(0);
                    }
                })
                .catch(() => {
                    setError("Failed to load products");
                });
        },
        [skip, limit]
    );

    const loadMore = () => {
        const toSkip = skip + limit;
        getFilteredProducts(toSkip, limit, myFilters.filters)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setFilteredResults([...filteredResults, ...data.data]);
                    setSize(data.size);
                    setSkip(toSkip);
                }
            })
            .catch(() => {
                setError("Failed to load more products");
            });
    };

    const loadMoreButton = () => {
        return (
            size > 0 &&
            size >= limit && (
                <button onClick={loadMore} className="btn btn-warning mb-5">
                    Load more
                </button>
            )
        );
    };

    useEffect(() => {
        init();
        loadFilteredResults(myFilters.filters);
    }, [init, loadFilteredResults, myFilters.filters]);

    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            const priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }

        setMyFilters(newFilters);
        loadFilteredResults(newFilters.filters);
    };

    const handlePrice = (value) => {
        const data = prices;
        let array = [];
        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    return (
        <Layout
            title="Shop Page"
            description="Search and find products of your choice"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox
                            categories={categories}
                            handleFilters={(filters) =>
                                handleFilters(filters, "category")
                            }
                        />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <RadioBox
                            prices={prices}
                            handleFilters={(filters) =>
                                handleFilters(filters, "price")
                            }
                        />
                    </div>
                </div>

                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    {/* Display error message */}
                    {error && <h4 className="text-danger">{error}</h4>}
                    <div className="row">
                        {filteredResults.map((product, i) => (
                            <div key={i} className="col-4 mb-3">
                                <Card product={product} />
                            </div>
                        ))}
                    </div>
                    <hr />
                    {loadMoreButton()}
                </div>
            </div>
        </Layout>
    );
};

export default Shop;
