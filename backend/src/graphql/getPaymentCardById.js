import gql from 'graphql-tag';

export default gql`
    query GetPaymentCardById($paymentCardId: ID!) {
        node(id: $paymentCardId) {
            ... on PaymentCard {
                id
                bin
                last4
                expirationDate
                network
                status
                formFactor
                restrictedDetails {
                    ... on PaymentCardRestrictedDetails {
                        number
                        cvv
                    }
                    ... on AccessDeniedError {
                        message
                    }
                }
                physicalPaymentCardOrders {
                    id
                    paymentCardShipment {
                        courier {
                            method
                            signatureRequiredOnDelivery
                            tracking {
                                trackingNumber
                                actualShipDateLocal
                            }
                        }
                        requestedShipDate
                        deliveryDetails {
                            name {
                                middleName
                                givenName
                                familyName
                                suffix
                                title
                            }
                            companyName
                            address {
                                streetAddress
                                extendedAddress
                                postalCode
                                region
                                locality
                                countryCodeAlpha3
                            }
                        }
                        senderDetails {
                            name {
                                givenName
                                middleName
                                familyName
                                suffix
                                title
                            }
                            companyName
                            address {
                                streetAddress
                                extendedAddress
                                postalCode
                                region
                                locality
                                countryCodeAlpha3
                            }
                        }
                    }
                    orderState {
                        status
                    }
                    cardPersonalization {
                        textLines {
                            line1
                            line2
                        }
                    }
                    createdAt
                    updatedAt
                    stateHistory {
                        previousStatus
                        newStatus
                        createdAt
                    }
                }
            }
        }
    }
`