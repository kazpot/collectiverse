const classes = {
  navbar: {
    height: '70px',
    backgroundColor: '#ffffff',
    fontSize: '20px',
    color: '#000000',
    fontWeight: 'bold',
    '& a': {
      color: '#000000',
      margin: '20px',
    },
  },
  navbarButton: {
    color: '#000000',
    textTransform: 'initial',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '2.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    marginTop: '10px',
    textAlign: 'center',
  },
  section: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  form: {
    margin: '20px',
    padding: '2px',
  },
  toolbar: {
    justifyContent: 'space-between',
  },
  mt1: {
    marginTop: '1rem',
  },
  ml7: {
    marginLeft: '7rem',
  },
  searchForm: {
    border: '2px solid #000000',
    backgroundColor: '#ffffff',
    borderRadius: '25px',
    height: '50px',
    width: '450px',
  },
  searchInput: {
    padding: '1px',
    color: '#000000',
    '& ::placeholder': {
      color: '#606060',
    },
    width: '400px',
  },
  iconButton: {
    backgroundColor: 'transparent',
    padding: '10px',
    borderRadius: '0 5px 5px 0',
    '& span': {
      color: '#000000',
    },
  },
  sort: {
    marginRight: '1px',
  },
  fullWidth: {
    width: '100%',
  },
  productPageText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#999',
  },
};

export default classes;
