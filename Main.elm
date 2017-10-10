module Main exposing (main)

import Html exposing (..)
import Html.Events exposing (onClick, onInput)
import Html.Attributes exposing (..)
import Http
import Json.Decode as Decode exposing (Decoder, map, map3, map2, field, string, int, maybe)


type alias Response a =
    { data : a
    }


type alias Author =
    { name : Name
    , id : Int
    }


type alias Name =
    { first : String
    , middle : Maybe String
    , last : String
    }


decodeName : Decoder Name
decodeName =
    map3 Name
        (field "first" string)
        (maybe <| field "middle" string)
        (field "last" (string))


decodeAuthor : Decoder Author
decodeAuthor =
    map2 Author
        (field "name" decodeName)
        (field "id" int)


decodeResponse : String -> Decoder a -> Decoder (Response a)
decodeResponse fieldName decoder =
    Decode.map Response (field "data" (field fieldName decoder))


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { author : Maybe Author
    , error : Maybe Http.Error
    , input : String
    }


type Msg
    = FetchAuthor
    | LoadAuthor (Result Http.Error (Response Author))
    | UpdateInput String


getAuthor : Int -> Http.Request (Response Author)
getAuthor id =
    Http.get
        ("http://localhost:3000/graphql?query={author(id:"
            ++ (toString id)
            ++ "){name{first,middle,last},id}}"
        )
        (decodeResponse "author" decodeAuthor)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UpdateInput string ->
            ({ model | input = string }) ! []

        FetchAuthor ->
            case String.toInt model.input of
                Ok id ->
                    ( Model Nothing Nothing "", Http.send LoadAuthor <| getAuthor id )

                Err _ ->
                    (model) ! []

        LoadAuthor (Ok response) ->
            ({ model | author = Just response.data }) ! []

        LoadAuthor (Err message) ->
            ({ model | error = Just (message) }) ! []


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Hit dat server" ]
        , div [] [ input [ value model.input, placeholder "Enter an id...", onInput UpdateInput ] [] ]
        , button [ onClick FetchAuthor ] [ text "Fetch some data" ]
        , viewAuthor (model.author)
        ]


viewAuthor : Maybe Author -> Html Msg
viewAuthor author =
    case author of
        Just { name } ->
            text <| name.first ++ " " ++ name.last

        Nothing ->
            text ""


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


init : ( Model, Cmd Msg )
init =
    (Model
        Nothing
        Nothing
        "1"
    )
        ! []
