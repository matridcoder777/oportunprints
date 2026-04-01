import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        productsProjects: 'Products & Projects',
        myOrders: 'My Orders',
        adminApprovals: 'Admin Approvals',
        ordersHistory: 'Orders History',
        shoppingCart: 'Shopping Cart',
        storeProfile: 'Store Profile',
        support: 'Support',
        contactUs: 'Contact Us',
      },
      dashboard: {
        welcome: 'Welcome back, {{name}}!',
        guidelines: 'Important Ordering Guidelines',
        guidelinesText:
          'Please review the ordering guidelines before placing an order.',
        portalDescription:
          'The Oportun Retail Print Portal enables authorized store staff to order branded print materials for their locations.',
      },
      login: {
        title: 'Oportun Retail Print Portal',
        username: 'Username',
        password: 'Password',
        loginButton: 'Log In',
        disclaimer:
          'This portal is for authorized Oportun retail staff only. Unauthorized access is prohibited.',
      },
      common: {
        loading: 'Loading…',
        error: 'An error occurred.',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search…',
        logout: 'Logout',
        noResults: 'No results found.',
        actions: 'Actions',
        close: 'Close',
        submit: 'Submit',
        confirm: 'Confirm',
      },
    },
  },
  es: {
    translation: {},
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
