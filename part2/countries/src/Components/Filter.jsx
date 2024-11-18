const Filter = ({searchTerm, handleSearchChange }) => (
    <div>
        find countries <input value={searchTerm} onChange={handleSearchChange} />
    </div>
)

export default Filter