import { createContext, useContext, useMemo, useReducer } from 'react'
import {
  reservations, rooms as initialRooms, housekeepingTasks, laundryOrders,
  posOrders, menuItems, kitchenOrders, inventoryItems, inventoryIssueRequests, inventoryReturnRequests, purchaseOrders,
  employees, leaveRequests, crmCustomers, fnbEvents, addonServices,
  feedbackEntries, maintenanceTickets, maintenanceInventoryItems, transactions, systemUsers, activityLog, notifications,
} from '../data/initialState'
import { nextId } from '../utils/helpers'
import { historyEntry } from '../utils/reservationHelpers'

const StoreContext = createContext(null)

function logActivity(log, action, module, detail) {
  return [{
    id: nextId('LOG-', log),
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    action,
    module,
    detail,
  }, ...log].slice(0, 50)
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESERVATION_CREATE': {
      const rooms = action.payload.rooms?.length ? action.payload.rooms : [action.payload.room]
      const item = {
        ...action.payload,
        id: nextId('RES-', state.reservations),
        rooms,
        room: rooms[0],
        notes: action.payload.notes || '',
        history: action.payload.history || [
          historyEntry('Created', `Booking confirmed — ${rooms.length} room(s)`),
        ],
      }
      return {
        ...state,
        reservations: [item, ...state.reservations],
        activityLog: logActivity(state.activityLog, 'Create', 'Reservation', `${item.guest} — ${rooms.join(', ')}`),
      }
    }
    case 'RESERVATION_UPDATE': {
      const prev = state.reservations.find((r) => r.id === action.id)
      const rooms = action.payload.rooms?.length ? action.payload.rooms : action.payload.room ? [action.payload.room] : prev?.rooms
      const { historyNote, ...rest } = action.payload
      const updated = {
        ...rest,
        rooms,
        room: rooms?.[0] || action.payload.room || prev?.room,
        history: [
          historyEntry('Modified', historyNote || 'Reservation details updated'),
          ...(prev?.history || []),
        ],
      }
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? { ...r, ...updated } : r)),
        activityLog: logActivity(state.activityLog, 'Update', 'Reservation', action.id),
      }
    }
    case 'ROOM_TRANSFER': {
      const res = state.reservations.find((r) => r.id === action.id)
      if (!res) return state
      const oldRoom = res.room
      const entry = historyEntry(
        action.transferType || 'Room Transfer',
        `${oldRoom} → ${action.newRoom}${action.reason ? ` — ${action.reason}` : ''}`,
      )
      const newRooms = (res.rooms || [oldRoom]).map((rm) => (rm === oldRoom ? action.newRoom : rm))
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? {
          ...r,
          room: action.newRoom,
          rooms: newRooms,
          history: [entry, ...(r.history || [])],
        } : r)),
        activityLog: logActivity(state.activityLog, 'Room Transfer', 'Reservation', `${res.guest}: ${oldRoom} → ${action.newRoom}`),
      }
    }
    case 'RESERVATION_DELETE':
      return {
        ...state,
        reservations: state.reservations.filter((r) => r.id !== action.id),
        activityLog: logActivity(state.activityLog, 'Delete', 'Reservation', action.id),
      }
    case 'CHECK_IN': {
      const res = state.reservations.find((r) => r.id === action.id)
      if (!res) return state
      const roomNum = res.room.split(' ').pop()
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? { ...r, status: 'Checked In' } : r)),
        rooms: state.rooms.map((rm) => (rm.number === roomNum ? { ...rm, status: 'Occupied' } : rm)),
        housekeepingTasks: [{
          id: nextId('HK-', state.housekeepingTasks),
          room: res.room,
          task: 'Checkout cleaning (scheduled)',
          assignee: 'Housekeeping Team',
          status: 'Scheduled',
          priority: 'Normal',
        }, ...state.housekeepingTasks],
        transactions: [{
          id: nextId('TXN-', state.transactions),
          type: 'Revenue',
          category: 'Room',
          description: `Check-in folio opened — ${res.guest}`,
          amount: 'OMR 8,500',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        }, ...state.transactions],
        crmCustomers: state.crmCustomers.map((c) => (
          c.name === res.guest ? { ...c, lastStay: 'Today', visits: (c.visits || 0) + 1 } : c
        )),
        activityLog: logActivity(state.activityLog, 'Check-in', 'Front Office', `${res.guest} → ${res.room}`),
      }
    }
    case 'CHECK_OUT': {
      const res = state.reservations.find((r) => r.id === action.id)
      if (!res) return state
      const roomNum = res.room.split(' ').pop()
      return {
        ...state,
        reservations: state.reservations.map((r) => (r.id === action.id ? { ...r, status: 'Checked Out' } : r)),
        rooms: state.rooms.map((rm) => (rm.number === roomNum ? { ...rm, status: 'Dirty' } : rm)),
        housekeepingTasks: [{
          id: nextId('HK-', state.housekeepingTasks),
          room: res.room,
          task: 'Post checkout cleaning',
          assignee: 'Unassigned',
          status: 'Pending',
          priority: 'High',
        }, ...state.housekeepingTasks],
        activityLog: logActivity(state.activityLog, 'Check-out', 'Front Office', `${res.guest} — Finance & HK updated`),
      }
    }
    case 'GENERIC_CREATE':
      return {
        ...state,
        [action.key]: [{ ...action.payload, id: action.payload.id || nextId(action.prefix, state[action.key]) }, ...state[action.key]],
        activityLog: logActivity(state.activityLog, 'Create', action.module, action.detail || action.payload.name || action.payload.guest || ''),
      }
    case 'GENERIC_UPDATE':
      return {
        ...state,
        [action.key]: state[action.key].map((item) => (
          item.id === action.id || item.name === action.id ? { ...item, ...action.payload } : item
        )),
        activityLog: logActivity(state.activityLog, 'Update', action.module, String(action.id)),
      }
    case 'GENERIC_DELETE':
      return {
        ...state,
        [action.key]: state[action.key].filter((item) => item.id !== action.id && item.name !== action.id),
        activityLog: logActivity(state.activityLog, 'Delete', action.module, String(action.id)),
      }
    case 'CUSTOMER_BOOKING': {
      const booking = {
        id: nextId('CB-', state.customerBookings),
        ...action.payload,
        status: 'Confirmed',
        source: 'Customer Portal',
      }
      const reservation = {
        id: nextId('RES-', state.reservations),
        guest: action.payload.guest,
        source: 'Customer Portal',
        room: action.payload.room,
        rooms: [action.payload.room],
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
        checkInIso: action.payload.checkInIso,
        checkOutIso: action.payload.checkOutIso,
        status: 'Confirmed',
        notes: '',
        history: [historyEntry('Created', 'Customer portal booking')],
      }
      return {
        ...state,
        customerBookings: [booking, ...state.customerBookings],
        reservations: [reservation, ...state.reservations],
        activityLog: logActivity(state.activityLog, 'Booking', 'Customer Portal', `${booking.guest} — ERP synced`),
      }
    }
    default:
      return state
  }
}

const initialState = {
  reservations,
  rooms: initialRooms,
  housekeepingTasks,
  laundryOrders,
  posOrders,
  menuItems,
  kitchenOrders,
  inventoryItems,
  inventoryIssueRequests,
  inventoryReturnRequests,
  purchaseOrders,
  employees,
  leaveRequests,
  crmCustomers,
  fnbEvents,
  addonBookings: addonServices,
  feedback: feedbackEntries,
  maintenanceTickets,
  maintenanceInventoryItems,
  transactions,
  systemUsers,
  activityLog,
  notifications,
  customerBookings: [],
  customerServiceBookings: [],
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const actions = useMemo(() => ({
    create: (key, prefix, module, payload, detail) =>
      dispatch({ type: 'GENERIC_CREATE', key, prefix, module, payload, detail }),
    update: (key, module, id, payload) =>
      dispatch({ type: 'GENERIC_UPDATE', key, module, id, payload }),
    remove: (key, module, id) =>
      dispatch({ type: 'GENERIC_DELETE', key, module, id }),
    createReservation: (payload) => dispatch({ type: 'RESERVATION_CREATE', payload }),
    updateReservation: (id, payload) => dispatch({ type: 'RESERVATION_UPDATE', id, payload }),
    deleteReservation: (id) => dispatch({ type: 'RESERVATION_DELETE', id }),
    transferRoom: (id, payload) => dispatch({ type: 'ROOM_TRANSFER', id, ...payload }),
    checkIn: (id) => dispatch({ type: 'CHECK_IN', id }),
    checkOut: (id) => dispatch({ type: 'CHECK_OUT', id }),
    customerBookRoom: (payload) => dispatch({ type: 'CUSTOMER_BOOKING', payload }),
    customerBookService: (payload) =>
      dispatch({
        type: 'GENERIC_CREATE',
        key: 'customerServiceBookings',
        prefix: 'CS-',
        module: 'Customer Portal',
        payload: { ...payload, status: 'Booked' },
        detail: payload.service,
      }),
  }), [])

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
