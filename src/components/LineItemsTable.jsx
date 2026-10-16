/**
 * AURA RECEIPT — Line Items Table
 * ------------------------------------------------------------
 * Fully responsive:
 *   - Mobile: each item is a self-contained card
 *   - Desktop: 5-column grid
 *
 * Always keeps one row. No fixed widths that overflow.
 * ------------------------------------------------------------
 */

import { ListPlus, Plus, Trash2, AlertCircle } from 'lucide-react';
import { formatAmount } from '../utils/currency';

const LineItemsTable = ({ receipt, errors }) => {
  const { items, addItem, removeItem, updateItem, currency } = receipt;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListPlus size={16} className="text-gray-400" />
          <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
            Items <span className="text-red-500">*</span>
          </span>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-brand-purple hover:bg-brand-purple/5 rounded-md transition-colors"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      <div className="p-5">

        {/* Desktop column headers */}
        <div className="hidden md:grid md:grid-cols-[minmax(0,1fr)_72px_112px_112px_36px] gap-3 mb-2 px-1">
          <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Description</div>
          <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase text-center">Qty</div>
          <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase text-right">Price</div>
          <div className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase text-right">Total</div>
          <div />
        </div>

        {/* Rows */}
        <div className="space-y-3 md:space-y-2">
          {items.map((item, index) => {
            const lineTotal = (Number(item.qty) || 0) * (Number(item.price) || 0);
            const hasError = errors?.items?.[index];

            return (
              <div
                key={item.id}
                className={`md:grid md:grid-cols-[minmax(0,1fr)_72px_112px_112px_36px] md:gap-3 md:items-center p-3 md:p-1 border rounded-lg md:border-0 md:rounded-none ${hasError ? 'border-red-200 md:border-0' : 'border-gray-100 md:border-0'
                  }`}
              >
                {/* Mobile: item label + remove */}
                <div className="md:hidden flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    Item {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Description */}
                <div className="mb-2 md:mb-0 min-w-0">
                  <label className="md:hidden text-[10px] font-medium text-gray-500 mb-1 block">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    placeholder="Item or service"
                    className="w-full px-3 py-2 text-[14px] border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                  />
                </div>

                {/* Mobile: qty + price side by side */}
                <div className="grid grid-cols-2 gap-3 md:block mb-2 md:mb-0">
                  <div>
                    <label className="md:hidden text-[10px] font-medium text-gray-500 mb-1 block">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, { qty: e.target.value })}
                      className="w-full px-3 py-2 text-[14px] text-center border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                    />
                  </div>
                  <div className="md:hidden">
                    <label className="text-[10px] font-medium text-gray-500 mb-1 block">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, { price: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 text-[14px] text-right border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Desktop price */}
                <div className="hidden md:block">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(item.id, { price: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 text-[14px] text-right border border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 outline-none transition-colors"
                  />
                </div>

                {/* Line total */}
                <div className="flex items-center justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 md:px-2 min-w-0">
                  <span className="md:hidden text-[10px] font-medium text-gray-500 uppercase">Line Total</span>
                  <span className="text-[14px] font-semibold text-brand-ink font-mono truncate">
                    {formatAmount(lineTotal, currency)}
                  </span>
                </div>

                {/* Desktop remove */}
                <div className="hidden md:flex md:justify-center">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Mobile inline error */}
                {hasError && (
                  <div className="md:hidden flex items-center gap-1.5 mt-2 text-[11px] text-red-500">
                    <AlertCircle size={12} />
                    {hasError}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error under all items */}
        {errors?.itemsGeneral && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-red-500">
            <AlertCircle size={12} />
            {errors.itemsGeneral}
          </div>
        )}

        {/* Add another row */}
        <button
          type="button"
          onClick={addItem}
          className="mt-4 w-full py-2.5 border border-dashed border-gray-200 rounded-lg text-[12px] font-medium text-gray-500 hover:border-brand-purple hover:text-brand-purple transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          Add another item
        </button>

      </div>
    </div>
  );
};

export default LineItemsTable;