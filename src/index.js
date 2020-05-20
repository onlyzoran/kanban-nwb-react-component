import React, {useState} from 'react'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const initialState = {
    columns: [
        {
            id: 1,
            order: 0,
            title: 'Наряды',
            createCard: true,
            color: 'lightgray'
        },
        {
            id: 2,
            order: 1,
            title: 'В работе',
            createCard: false,
            color: 'lightgreen'
        },
        {
            id: 3,
            order: 2,
            title: 'Приемка',
            createCard: false,
            color: 'orange'
        },
        {
            id: 4,
            order: 3,
            title: 'Завершено',
            createCard: false,
            color: 'blue'
        },
    ],
    cards: [
        {
            id: 1,
            title: 'Установка плит под фундамент',
            columnId: 1,
            date: '20-5-2020'
        },
        {
            id: 2,
            title: 'Земельные работы по подготовке площадки для несущей стены',
            columnId: 1,
            date: '20-5-2020'
        },
        {
            id: 3,
            title: 'Установка плит под фундамент 2',
            columnId: 2,
            date: '20-5-2020'
        },
        {
            id: 4,
            title: 'Установка плит под фундамент 3',
            columnId: 2,
            date: '20-5-2020'
        },
        {
            id: 5,
            title: 'Земельные работы по подготовке площадки для несущей стены 2',
            columnId: 3,
            date: '20-5-2020'
        },
        {
            id: 6,
            title: 'Установка плит под фундамент 4',
            columnId: 3,
            date: '20-5-2020'
        },
        {
            id: 7,
            title: 'Установка плит под фундамент 5',
            columnId: 4,
            date: '20-5-2020'
        },
        {
            id: 8,
            title: 'Установка плит под фундамент 6',
            columnId: 4,
            date: '20-5-2020'
        }
    ],
    currentCard: {},
    startDroppableIndex: null
};

const styles = {
    column: {
        column: {
            width: '200px'
        },
        columnHead: {
            background: '#f4f4f4',
            borderRadius: '10px',
            width: '100%',
            height: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box',
            padding: '10px',
            marginBottom: '10px'
        },
        columnTitle: {
            display: 'flex',
            alignItems: 'center'
        },
        columnBody: {
            background: '#f4f4f4',
            borderRadius: '10px',
            width: '100%',
            padding: '10px',
            boxSizing: 'border-box'
        }
    }
};

const ColumnsList = ({columns, cards, currentCard, addNewCard, getCard, setStartDroppableId, startDroppableIndex, changeCardColumn}) => {
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        changeCardColumn(result.draggableId, result.destination.droppableId, result.destination.index);
    };

    const onDragStart = (result) => {
        setStartDroppableId(parseInt(result.source.droppableId))
    };

    const ColumnsListElements = columns.map((column, index) => {
        const isDropDisabled = Math.abs(index - startDroppableIndex) > 1;

        return (
            <Droppable key={column.id} droppableId={column.id.toString()} isDropDisabled={isDropDisabled}>
                {(droppableProvided) => (
                    <div
                        ref={droppableProvided.innerRef}
                        style={{margin: '10px'}}
                    >
                        <Column
                            id={column.id}
                            title={column.title}
                            createCard={column.createCard}
                            color={column.color}
                            cards={cards}
                            currentCard={currentCard}
                            addNewCard={addNewCard}
                            getCard={getCard}
                        />
                        {droppableProvided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    });

    return (
        <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
            <div style={{display: 'flex'}}>
                {ColumnsListElements}
            </div>
        </DragDropContext>
    )
};

const Column = ({cards, id, title, createCard, color, isFirstColumn, isLastColumn, currentCard, getCard, ...props}) => {
    const [adding, setAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const addButtonClick = () => {
        props.addNewCard(newTitle, id);
        setNewTitle('');
        setAdding(false);
    };

    const closeButtonClick = () => {
        setNewTitle('');
        setAdding(false);
    };

    return (
        <div style={styles.column.column}>
            <div style={styles.column.columnHead}>
                <div style={styles.column.columnTitle}>
                    <FiberManualRecordIcon style={{fontSize: 10, marginRight: '5px', color: color}}/>
                    <Typography component="p">
                        {title}
                    </Typography>
                </div>
                {createCard &&
                <IconButton size="small" onClick={() => setAdding(true)}>
                    <AddIcon fontSize="inherit"/>
                </IconButton>
                }
            </div>
            <div style={styles.column.columnBody}>
                <CardsList cards={cards} columnId={id} getCard={getCard} currentCard={currentCard}
                           isFirstColumn={isFirstColumn} isLastColumn={isLastColumn}/>
                {adding &&
                <Card style={{marginBottom: '5px'}}>
                    <CardContent>
                        <form noValidate autoComplete="off">
                            <TextField id="standard-basic" label="Title" value={newTitle}
                                       onChange={(e) => setNewTitle(e.target.value)}/>
                        </form>
                    </CardContent>
                    <CardActions>
                        <IconButton size="small" color="secondary" onClick={() => closeButtonClick()}
                                    style={{marginLeft: 'auto'}}>
                            <CloseIcon fontSize="inherit"/>
                        </IconButton>
                        <IconButton size="small" color="primary" onClick={() => addButtonClick()}>
                            <CheckIcon fontSize="inherit"/>
                        </IconButton>
                    </CardActions>
                </Card>
                }
            </div>
        </div>
    );
}

const CardsList = ({cards, columnId, getCard, ...props}) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = (cardId) => {
        getCard(cardId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const currentColumnCards = cards.filter(card => card.columnId === columnId);
    const cardElements = currentColumnCards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
            {(draggableProvided, draggableSnapshot) => (
                <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                >
                    <Card style={{marginBottom: '5px', opacity: draggableSnapshot.isDragging ? 0.5 : 1}}
                          onClick={() => handleOpen(card.id)}>
                        <CardContent style={{padding: '4px 8px'}}>
                            <Typography variant="subtitle2" gutterBottom>
                                {card.title}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                                {card.date}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            )}
        </Draggable>
    ));

    return (
        <>
            {cardElements}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
                <Fade in={open} style={{backgroundColor: '#fff', border: '2px solid #000', padding: '16px 32px 24px'}}>
                    <div>
                        <Typography component="h2">
                            {props.currentCard.title}
                        </Typography>
                    </div>
                </Fade>
            </Modal>
        </>
    );
};

export default () => {
    const [columns] = useState(initialState.columns);
    const [cards, setCards] = useState(initialState.cards.sort((a, b) => (a.columnId >= b.columnId) ? 1 : -1));
    const [currentCard, setCurrentCard] = useState(initialState.currentCard);
    const [startDroppableIndex, setStartDroppableIndex] = useState(initialState.startDroppableIndex);

    const changeCardColumn = (cardId, newColumnId, destinationIndex) => {
        const newCards = [...cards];
        const sortColumns = [...columns];

        cardId = parseInt(cardId);
        newColumnId = parseInt(newColumnId);
        const columnCardIndex = newCards.findIndex(card => card.columnId === newColumnId);

        const cardIndex = [...cards].findIndex(card => card.id === cardId);
        const oldColumnId = newCards[cardIndex].columnId;
        const oldColumnIndex = sortColumns.findIndex(column => column.id === oldColumnId);
        const newColumnIndex = sortColumns.findIndex(column => column.id === newColumnId);
        newCards[cardIndex].columnId = newColumnId;

        const [removed] = newCards.splice(cardIndex, 1);

        let endIndex = columnCardIndex + destinationIndex;
        if (oldColumnIndex < newColumnIndex) {
            endIndex--;
        }
        newCards.splice(endIndex, 0, removed);

        setCards(newCards);
    };

    const addNewCard = (cardTitle, columnId) => {
        const newId = Math.max.apply(Math, [...cards].map((card) => (card.id)));
        const newDate = new Date();
        console.log(newDate);
        const newDateString = `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()}`;

        const newCard = {
            id: newId + 1,
            title: cardTitle,
            columnId: columnId,
            date: newDateString
        };

        const columnIndex = [...columns].findIndex(column => column.id === columnId);
        const nexColumnId = columns[columnIndex + 1].id;

        const columnCardIndex = [...cards].findIndex(card => card.columnId === nexColumnId);
        const newCards = [...cards, newCard];

        const [removed] = newCards.splice(newCards.length - 1, 1);
        newCards.splice(columnCardIndex, 0, removed);

        setCards(newCards);
    }

    const getCard = (cardId) => {
        const currentCard = [...cards].find(card => card.id === cardId);
        setCurrentCard(currentCard);
    }

    const setStartDroppableId = (startDroppableId) => {
        const startDroppableIndex = [...columns].findIndex(column => column.id === startDroppableId);
        setStartDroppableIndex(startDroppableIndex);
    }

    return (
        <div>
            <ColumnsList
                addNewCard={addNewCard}
                getCard={getCard}
                changeCardColumn={changeCardColumn}
                columns={columns}
                cards={cards}
                currentCard={currentCard}
                setStartDroppableId={setStartDroppableId}
                startDroppableIndex={startDroppableIndex}
            />
        </div>
    );
}
