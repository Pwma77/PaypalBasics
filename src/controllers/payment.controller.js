import axios from "axios";
import { HOST, PAYPAL_API, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } from "../config";

export const createOrder = async (req, res) => {
    try {
        const order = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: '10.00'
                    },
                    description: 'Monthly Payment'
                },
            ],
            application_context: {
                brand_name: 'mind-residentials.com',
                landing_page: 'LOGIN',
                user_action: 'PAY_NOW',
                return_url: `${HOST}capture-order`,
                cancel_url: `${HOST}cancel-order`
            },
        };
    const params = new URLSearchParams()
    params.append("grant_type", "client_credentials")
    
    const { data: {access_token} } = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    });
    
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    
        res.json(response.data);

    } catch (error) {
        return res.status(500).send('An error occured on payment')
    }
};

export const captureOrder = async (req, res) => {
    const { token, PayerID } = req.query;

    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
        auth: {
            username: PAYPAL_API_CLIENT,
            password: PAYPAL_API_SECRET
        }
    });

    console.log(response.data);

    return res.redirect('/payed.html');
}

export const cancelOrder = (req, res) => {
    res.redirect('http://localhost:3000');
}