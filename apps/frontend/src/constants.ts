import { FilterOperator } from "@/types";

export const AUTH_EXEMPT = "exempt-auth";
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const PROPERTY_FIELDS = {
    Numeric: [
        {
            operator: FilterOperator.GREATER_THAN,
            label: "Is greater than",
        },
        {
            operator: FilterOperator.LESS_THAN,
            label: "Is less than",
        },
        {
            operator: FilterOperator.IS,
            label: "Is",
        },
        {
            operator: FilterOperator.IS_NOT,
            label: "Is not",
        },
        {
            operator: FilterOperator.HAS_ANY_VALUE,
            label: "Has any value",
        },
        {
            operator: FilterOperator.IS_UNKNOWN,
            label: "Is unknown",
        },
    ],
    String: [
        {
            operator: FilterOperator.IS,
            label: "Is",
        },
        {
            operator: FilterOperator.IS_NOT,
            label: "Is not",
        },
        {
            operator: FilterOperator.HAS_ANY_VALUE,
            label: "Has any value",
        },
        {
            operator: FilterOperator.CONTAINS,
            label: "Contains",
        },
        {
            operator: FilterOperator.DOES_NOT_CONTAIN,
            label: "Does not contain",
        },
        {
            operator: FilterOperator.STARTS_WITH,
            label: "Starts with",
        },
        {
            operator: FilterOperator.ENDS_WITH,
            label: "Ends with",
        },
        {
            operator: FilterOperator.IS_UNKNOWN,
            label: "Is unknown",
        },
    ],
    Boolean: [
        {
            operator: FilterOperator.IS_TRUE,
            label: "Is true",
        },
        {
            operator: FilterOperator.IS_FALSE,
            label: "Is false",
        },
        {
            operator: FilterOperator.HAS_ANY_VALUE,
            label: "Has any value",
        },
        {
            operator: FilterOperator.IS_UNKNOWN,
            label: "Is unknown",
        },
    ],
    Datetime: [
        {
            operator: FilterOperator.GREATER_THAN,
            label: "Is greater than",
        },
        {
            operator: FilterOperator.LESS_THAN,
            label: "Is less than",
        },
        {
            operator: FilterOperator.HAS_ANY_VALUE,
            label: "Has any value",
        },
        {
            operator: FilterOperator.IS_UNKNOWN,
            label: "Is unknown",
        },
    ],
};
