import { useMemo, useState } from 'react'
import {
    Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControlLabel, Radio, RadioGroup, Stack, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography,
} from '@mui/material'
import { analyseRows, dupKey } from '../utils/csv'
import { money, nameOf } from '../utils/format'

// Render only while open: {rows && <ImportDialog ... />}
export default function ImportDialog({ rows, existing, onClose, onImport }) {
    const [dayFirst, setDayFirst] = useState(true)

    const { missing, items } = useMemo(() => analyseRows(rows, { dayFirst }), [rows, dayFirst])
    const existingKeys = useMemo(
        () => new Set(existing.map((e) => dupKey(nameOf(e), e.amount, e.date))),
        [existing],
    )

    const tagged = items.map((it) => ({
        ...it,
        status: it.error
            ? 'invalid'
            : it.credit
                ? 'credit'
                : existingKeys.has(dupKey(it.name, it.amount, it.date))
                    ? 'duplicate'
                    : 'ready',
    }))
    const ready = tagged.filter((r) => r.status === 'ready')
    const duplicates = tagged.filter((r) => r.status === 'duplicate').length
    const invalid = tagged.filter((r) => r.status === 'invalid').length
    const credits = tagged.filter((r) => r.status === 'credit').length

    return (
        <Dialog open onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Import expenses from CSV</DialogTitle>
            <DialogContent>
                {missing.length > 0 ? (
                    <Alert severity="error">
                        Couldn't find a {missing.join(', ')} column. The first row of your file needs headers such as
                        {' '}<b>name</b> (or description), <b>amount</b> and <b>date</b>. A <b>category</b> column is optional.
                    </Alert>
                ) : (
                    <>
                        <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap" sx={{ mb: 2 }}>
                            <Typography variant="body2">Dates like 03/04/2026 are:</Typography>
                            <RadioGroup row value={dayFirst ? 'dmy' : 'mdy'} onChange={(e) => setDayFirst(e.target.value === 'dmy')}>
                                <FormControlLabel value="dmy" control={<Radio size="small" />} label="Day / Month / Year" />
                                <FormControlLabel value="mdy" control={<Radio size="small" />} label="Month / Day / Year" />
                            </RadioGroup>
                        </Stack>

                        <Typography sx={{ mb: 1 }}>
                            <b>{ready.length}</b> ready to import
                            {duplicates > 0 && <> · {duplicates} duplicate{duplicates === 1 ? '' : 's'} skipped</>}
                            {invalid > 0 && <> · {invalid} invalid</>}
                            {credits > 0 && <> · {credits} money-in row{credits === 1 ? '' : 's'} skipped</>}
                        </Typography>

                        <TableContainer sx={{ maxHeight: 360 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Row</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tagged.slice(0, 200).map((r) => (
                                        <TableRow key={r.line} sx={{ opacity: r.status === 'ready' ? 1 : 0.6 }}>
                                            <TableCell>{r.line}</TableCell>
                                            <TableCell>{r.name || '—'}</TableCell>
                                            <TableCell align="right">{r.amount > 0 ? money(r.amount) : '—'}</TableCell>
                                            <TableCell>{r.date || '—'}</TableCell>
                                            <TableCell>{r.category}</TableCell>
                                            <TableCell>
                                                {r.status === 'ready' && <Chip size="small" color="success" label="Ready" />}
                                                {r.status === 'duplicate' && <Chip size="small" label="Duplicate, skipped" />}
                                                {r.status === 'invalid' && <Chip size="small" color="error" label={r.error} />}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {tagged.length > 200 && (
                            <Typography variant="caption" color="text.secondary">
                                Showing the first 200 of {tagged.length} rows. All valid rows will be imported.
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" disabled={ready.length === 0} onClick={() => onImport(ready)}>
                    Import {ready.length > 0 ? ready.length : ''}
                </Button>
            </DialogActions>
        </Dialog>
    )
}