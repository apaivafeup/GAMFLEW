using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class WinByProxyChallenge : CheckersBoard 
{

    public override void Start()
    {
        whitePiecePrefab = (GameObject)Resources.Load("Prefabs/WhitePieceVariant");
        blackPiecePrefab = (GameObject)Resources.Load("Prefabs/BlackPieceVariant");
        isWhiteTurn = true;
        forcedPieces = new List<Piece>();
        isWhite = true;
        Debug.Log("You're in Challenge");
        GenerateBoard();
    }
}
