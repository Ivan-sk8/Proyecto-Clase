import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { DataTable, Card, IconButton, MD3Colors } from 'react-native-paper';
import { estadologinGlobal } from '../../context/contextData';

export default function ScreenUsers() {

    const [page, setPage] = React.useState();
    const [numberOfItemsPerPageList] = React.useState([5]);
    const [itemsPerPage, onItemsPerPageChange] = React.useState(
        numberOfItemsPerPageList[0]
    );

    const { getDataUsers, dataUsers, deleteUser } = useContext(estadologinGlobal);
    console.log('dataUsers:', dataUsers);

    React.useEffect(() => {
        getDataUsers();
    }, []);


    const items = dataUsers;

    const from = page * itemsPerPage;
    const to = Math.min((page + 2) * itemsPerPage, items.length);

    React.useEffect(() => {
        setPage(0);
    }, [itemsPerPage]);

    return (
        <View style={{ padding: 20 }}>
            <Text>ScreenUsers</Text>
            <Card>
                {/* Tabla */}
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>ID</DataTable.Title>
                        <DataTable.Title>Nombre</DataTable.Title>
                        <DataTable.Title numeric>email</DataTable.Title>
                        <DataTable.Title numeric>status</DataTable.Title>
                        <DataTable.Title numeric>Acción</DataTable.Title>
                    </DataTable.Header>

                    {items.slice(from, to).map((item) => (
                        <DataTable.Row key={item.key}>
                            <DataTable.Cell>{item.id}</DataTable.Cell>
                            <DataTable.Cell>{item.nombre}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.email}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.status}</DataTable.Cell>
                            <DataTable.Cell numeric>
                                <IconButton
                                    icon="trash-can"
                                    iconColor={MD3Colors.error50}
                                    size={20}
                                    onPress={() => deleteUser(item.id)}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(items.length / itemsPerPage)}
                        onPageChange={(page) => setPage(page)}
                        label={`${from + 1}-${to} of ${items.length}`}
                        numberOfItemsPerPageList={numberOfItemsPerPageList}
                        numberOfItemsPerPage={itemsPerPage}
                        onItemsPerPageChange={onItemsPerPageChange}
                        showFastPaginationControls
                        selectPageDropdownLabel={'Rows per page'}
                    />
                </DataTable>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({})