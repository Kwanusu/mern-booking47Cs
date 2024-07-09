
type Props = {
    selectedPrice?: number;
    onChange: (event?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
    return (
        <div className="border-b border-slate-300 pb-5">
            <h4 className='text-md font-semibold mb-2'>Max Price</h4>
            <select value={selectedPrice}
                className="text-md font-semibold mb-2"
                onChange={(event) => 
                    onChange(event.target.value ? 
                        parseInt(event.target.value) : undefined
            )
            }>
                <option value="">Select Max Price</option>
                {[1000, 2000, 2500, 3000, 4000, 5000].map((price) => (
                    <option value={price}>{price}</option>))}
                
            </select>
          
        </div>
    )
};

export default PriceFilter;