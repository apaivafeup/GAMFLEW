using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;

public class CheckersBoard : MonoBehaviour
{
    public Piece[,] pieces = new Piece[8, 8];
    public GameObject whitePiecePrefab;
    public GameObject blackPiecePrefab;

    private protected Vector3 boardOffset = new(-4.0f, 0, -4.0f);
    private protected Vector3 pieceOffset = new(0.5f, 0, 0.5f);

    public bool isWhite;
    private protected bool isWhiteTurn;
    private protected bool hasKilled;
    private protected bool finished;

    private protected Piece selectedPiece;
    private protected List<Piece> forcedPieces;

    private protected Vector2 mouseOver;
    private protected Vector2 startDrag;
    private protected Vector2 endDrag;

    private protected Material original;
    private protected Material selected;
    private protected Material highlighted;

    public virtual void Start()
    {
        whitePiecePrefab = (GameObject) Resources.Load("Prefabs/WhitePieceVariant");
        blackPiecePrefab = (GameObject) Resources.Load("Prefabs/BlackPieceVariant");

        original = (Material) Resources.Load("Materials/Atlas");
        selected = (Material) Resources.Load("Materials/SelectedMaterial");
        highlighted = (Material)Resources.Load("Materials/HighlightedMaterial");

        isWhiteTurn = true;
        forcedPieces = new List<Piece>();
        isWhite = true;
        GenerateBoard();
    }
    private protected void Update()
    {
        UpdateMouseOver();

        //Debug.Log(mouseOver);
        if ((isWhite) ? isWhiteTurn : !isWhiteTurn)
        {
            int x = (int)mouseOver.x;
            int y = (int)mouseOver.y;

            if (selectedPiece != null)
            {
                UpdatePieceDrag(selectedPiece);
            }

            if (Input.GetMouseButtonDown(0))
            {
                SelectPiece(x, y);
            }

            if (Input.GetMouseButtonUp(0)) {
                if (selectedPiece != null)
                    selectedPiece.GetComponent<MeshRenderer>().material = original;

                TryMove((int) startDrag.x, (int) startDrag.y, x, y);
            }
        }
    }
    private protected void UpdateMouseOver()
    {
        if (!Camera.main)
        {
            Debug.Log("Unable to find main camera.");
            return;
        }

        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out RaycastHit hit, 25.0f, LayerMask.GetMask("Board")) || !finished)
        {
            mouseOver.x = (int)(hit.point.x - boardOffset.x);
            mouseOver.y = (int)(hit.point.z - boardOffset.z);
        }
        else
        {
            mouseOver.x = -1;
            mouseOver.y = -1;
        }
    }
    private protected void UpdatePieceDrag(Piece p)
    {
        if (!Camera.main)
        {
            Debug.Log("Unable to find main camera.");
            return;
        }

        if (Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), out RaycastHit hit, 25.0f, LayerMask.GetMask("Board")))
        {
            p.transform.position = hit.point + Vector3.up;
        }
    }
    private protected void SelectPiece(int x, int y)
    {
        // Check for out of bounds.
        if (x < 0 || x >= 8 || y < 0 || y >= 8)
            return;

        Piece p = pieces[x, y];
        if (p != null && p.isWhite == isWhite)
        {
            if (forcedPieces.Count == 0)
            {
                selectedPiece = p;
                selectedPiece.GetComponent<MeshRenderer>().material = selected;
                startDrag = mouseOver;
            } else
            {
                // Look for the piece under our forced pieces list.
                if (forcedPieces.Find(fp => fp == p) == null)
                {
                    return;
                }

                selectedPiece = p;
                selectedPiece.GetComponent<MeshRenderer>().material = selected;
                startDrag = mouseOver;

            }  
        }

    }
    private protected void TryMove(int startX, int startY, int endX, int endY)
    {
        forcedPieces = ScanForPossibleMove();

        startDrag = new Vector2(startX, startY);
        endDrag = new Vector2(endX, endY);
        selectedPiece = pieces[startX, startY];

        MovePiece(selectedPiece, endX, endY);

        // Check for out of bounds.
        if (endX < 0 || endX > 7 || endY < 0 || endY > 7)
        {
            if (selectedPiece != null)
                MovePiece(selectedPiece, startX, startY);
            
            startDrag = Vector2.zero;
            selectedPiece = null;
            return;
        }

        // If there is a selected Piece.
        if (selectedPiece != null)
        {
            // If no move is registered.
            if (endDrag == startDrag)
            {
                MovePiece(selectedPiece, startX, startY);
                startDrag = Vector2.zero;
                selectedPiece = null;
                return;
            }

            // Check if it's a valid move.
            if (selectedPiece.ValidMove(pieces, startX, startY, endX, endY))
            {
                // Did we kill anything - is this a jump.
                
                if (Mathf.Abs(startX - endX) == 2)
                {
                    Piece p = pieces[(startX + endX) / 2, (startY + endY) / 2];
                    
                    if (p != null)
                    {
                        pieces[(startX + endX) / 2, (startY + endY) / 2] = null;
                        Destroy(p.gameObject);
                        hasKilled = true;
                    }  
                }

                // Are we obligated to kill?
                if (forcedPieces.Count != 0 && !hasKilled)
                {
                    MovePiece(selectedPiece, startX, startY);
                    startDrag = Vector2.zero;
                    selectedPiece = null;
                    return;
                }

                pieces[endX, endY] = selectedPiece;
                pieces[startX, startY] = null;
                MovePiece(selectedPiece, endX, endY);

                EndTurn();
            } else
            {
                MovePiece(selectedPiece, startX, startY);
                startDrag = Vector2.zero;
                selectedPiece = null;
                return;
            }
        }
    }
    private protected void EndTurn()
    {
        int x = (int)endDrag.x;
        int y = (int)endDrag.y;

        if (selectedPiece != null)
        {
            if (selectedPiece.isWhite && !selectedPiece.isKing && y == 7)
            {
                selectedPiece.isKing = true;
                selectedPiece.transform.Rotate(Vector3.right * 180);
            } else if (!selectedPiece.isWhite && !selectedPiece.isKing && y == 0)
            {
                selectedPiece.isKing = true;
                selectedPiece.transform.Rotate(Vector3.right * 180);
            }
        }

        selectedPiece = null;
        startDrag = Vector2.zero;

        ChangeForcedPiecesMaterial(false);

        if (ScanForPossibleMove(x, y).Count != 0 && hasKilled)
        {
            ChangeForcedPiecesMaterial(true);
            return;
        }

        isWhiteTurn = !isWhiteTurn;
        isWhite = !isWhite;
        hasKilled = false;
        CheckVictory();

        ScanForPossibleMove();
        ChangeForcedPiecesMaterial(true);
    }
    private protected virtual void CheckVictory()
    {
        // Ending the game.
        var remainingPieces = FindObjectsOfType<Piece>();
        bool hasWhite = false, hasBlack = false;

        for (int i = 0; i < remainingPieces.Length; i++)
        {
            if (remainingPieces[i].isWhite)
            {
                hasWhite = true;
            } else
            {
                hasBlack = true;
            }
        }

        if ((hasWhite && !hasBlack) || (hasBlack && !hasWhite))
        {
            Victory(hasWhite);
        } else
        {
            var remainingWhitePieces = Array.FindAll(remainingPieces, p => p.isWhite);
            var remainingBlackPieces = Array.FindAll(remainingPieces, p => !p.isWhite);
            bool whiteAdvantage = remainingBlackPieces.Count() < remainingWhitePieces.Count();

            if (remainingBlackPieces.Count() == remainingWhitePieces.Count())
            {
                foreach (Piece p in remainingBlackPieces)
                {
                    if (p.HasMovesToPlay(pieces))
                    {
                        return;
                    }
                }

                foreach (Piece p in remainingWhitePieces)
                {
                    if (p.HasMovesToPlay(pieces))
                    {
                        return;
                    }
                }

                Tie();
            } else
            {
                var piecesToCheck = (whiteAdvantage ? remainingBlackPieces : remainingWhitePieces);

                for (int i = 0; i < piecesToCheck.Count(); i++)
                {
                    if (piecesToCheck.ElementAt(i).HasMovesToPlay(pieces))
                    {
                        return;
                    }
                }

                Victory(whiteAdvantage);
            }
        }
    }
    private protected void Victory(bool isWhite)
    {
        Debug.Log(isWhite ? "White won." : "Black won.");
        finished = true;
    }
    private protected void Tie()
    {
        Debug.Log("It's a tie!");
        finished = true;
    }
    private protected List<Piece> ScanForPossibleMove(int x, int y)
    {
        forcedPieces = new List<Piece>();

        // Check just the one piece.
        if (pieces[x, y].IsForcedToMove(pieces, x, y))
            forcedPieces.Add(pieces[x, y]);

        return forcedPieces;
    }
    private protected List<Piece> ScanForPossibleMove()
    {
        forcedPieces = new List<Piece>();

        // Check all the pieces.
        for (int i = 0; i < 8; i++)
        {
            for (int j = 0; j < 8; j++)
            {
                if (pieces[i,j] != null && pieces[i,j].isWhite == isWhiteTurn)
                {
                    if (pieces[i,j].IsForcedToMove(pieces, i, j))
                    {
                        forcedPieces.Add(pieces[i, j]);
                    }
                }
            }
        }

        return forcedPieces;
    }
    private protected virtual void GenerateBoard()
    {
        // Generate white team - first 3 rows.
        for (int y = 0; y < 3; y++)
        {
            for (int x = 0; x < 8; x += 2)
            {
                GeneratePiece((y % 2 == 0 ? x : x + 1), y);
            }
        }

        // Generate black team - first 3 rows.
        for (int y = 7; y > 4; y--)
        {
            for (int x = 0; x < 8; x += 2)
            {
                GeneratePiece((y % 2 == 0 ? x : x + 1), y);
            }
        }

    }
    private protected void GeneratePiece(int x, int y)
    {
        GameObject go = Instantiate(y < 4 ? whitePiecePrefab : blackPiecePrefab) as GameObject;
        go.transform.SetParent(transform);
        Piece p = go.GetComponent<Piece>();
        p.transform.SetParent(GameObject.Find("Board").transform);
        pieces[x, y] = p;
        MovePiece(p, x, y);
    }
    private protected void MovePiece(Piece p, int x, int y)
    {
        if (p != null)
        {
            p.transform.position = (Vector3.right * x) + (Vector3.forward * y) + boardOffset + pieceOffset;
            p.setPosition(x, y);
        }
    }
    private protected void ChangeForcedPiecesMaterial(bool mistake)
    {
        if (mistake)
        {
            foreach (Piece p in forcedPieces)
            {
                p.GetComponent<MeshRenderer>().material = highlighted;
            }
        } else
        {
            foreach (Piece p in forcedPieces)
            {
                p.GetComponent<MeshRenderer>().material = original;
            }
        }
    }
}
