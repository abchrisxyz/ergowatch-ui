const AddressLink = ({ address, children }) => (
  <a
    href={"https://explorer.ergoplatform.com/en/addresses/" + address}
    target="_blank"
    rel="noreferrer"
  >
    {children}
  </a>
);


export { AddressLink };
